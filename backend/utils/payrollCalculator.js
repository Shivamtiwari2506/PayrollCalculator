
// Pure payroll calculation logic — no DB calls here.
// Takes employee + active payroll settings + tax slabs, returns a full breakdown.



// Calculate income tax (TDS) for an employee's annual gross salary.
// Uses the provided tax slabs (already fetched from DB).

function calculateTDS(annualGross, standardDeduction, slabs, cessPercent, rebateLimit) {
  // Step 1: Calculate taxable income
  const taxableIncome = Math.max(0, annualGross - standardDeduction);
  let tax = 0;
  // Step 2: Progressive slab calculation
  for (const slab of slabs) {
    const min = slab.minIncome;
    const max = slab.maxIncome ?? Infinity;

    // Stop iterating if taxable income is below this slab's minimum
    if (taxableIncome <= min) break;

    // Calculate income falling within this specific slab
    const taxable = Math.min(taxableIncome, max) - min;
    tax += (taxable * slab.rate) / 100;
  }

  // Step 3: Rebate under 87A with Marginal Relief (FIXED)
  if (taxableIncome <= rebateLimit) {
    tax = 0;
  } else {
    // Income over the limit
    const excessIncome = taxableIncome - rebateLimit;
    // Tax cannot be higher than the actual excess income earned
    if (tax > excessIncome) {
      tax = excessIncome;
    }
  }

  // Step 4: Calculate Cess
  const cess = (tax * cessPercent) / 100;

  // Step 5: Calculate Annual Tax
  const annualTax = tax + cess;

  // Step 6: Calculate Monthly TDS
  return Math.round(annualTax / 12);
}


// Main calculation function.
// employee   - { id, name, designation, ctc }
// settings   - Active PayrollSettings record 
// taxConfig - { standardDeduction, cessPercentage, slabs[] } or null if TDS disabled
// Full per-employee payroll breakdown

export function calculateEmployeePayroll(employee, settings, taxConfig = null) {
  console.log('employee: ', employee);
  const annualCTC = employee.ctc ?? 0;
  const monthlyCTC = annualCTC / 12;

  // --- Gross earnings breakdown ---
  const basic = Math.round((monthlyCTC * settings.basicPercent) / 100);
  // const hra = Math.round((monthlyCTC * settings.hraPercent) / 100);
  const hra = Math.round((basic * settings.hraPercent) / 100);
  const allowance = monthlyCTC - (basic + hra);
  const grossSalary = basic + hra + allowance;

  // --- PF ---
  let pfEmployee = 0;
  let pfEmployer = 0;
  if (settings.pfEnabled) {
    const pfBase = Math.min(basic, settings.pfCeiling);
    pfEmployee = Math.round((pfBase * settings.pfPercent) / 100);
    pfEmployer = Math.round((pfBase * settings.pfEmployerContribution) / 100);
  }

  // --- ESI ---
  let esiEmployee = 0;
  let esiEmployer = 0;
  if (settings.esiEnabled && grossSalary <= settings.esiCeiling) {
    esiEmployee = Math.round((grossSalary * settings.esiPercent) / 100);
    esiEmployer = Math.round((grossSalary * settings.esiEmployerPercent) / 100);
  }

  // --- Professional Tax ---
  const professionalTax = settings.professionalTaxEnabled
    ? settings.professionalTaxAmount
    : 0;

  let gratuity = 0;
  if (settings?.gratuityEnabled) {
    gratuity = Math.round((basic * 4.8) / 100);
  }

  // --- TDS ---
  let tds = 0;
  if (settings.tdsEnabled && taxConfig) {
    tds = calculateTDS(
      annualCTC,
      taxConfig.standardDeduction,
      taxConfig.slabs,
      taxConfig.cessPercentage,
      taxConfig?.rebateLimit
    );
  }

  // --- Total deductions (employee side only) ---
  const totalDeductions = pfEmployee + esiEmployee + professionalTax + tds;

  // --- Net pay ---
  const netPay = grossSalary - totalDeductions;

  const breakdown = {
    annualCTC,
    monthlyCTC,
    earnings: { basic, hra, allowance, grossSalary },
    deductions: {
      pfEmployee,
      esiEmployee,
      professionalTax,
      tds,
      loanDeduction: 0,
      advanceDeduction: 0,
      otherDeductions: 0,
      totalDeductions,
    },
    employerContributions: { pfEmployer, esiEmployer },
    netPay,
  };

  return {
    employeeName: employee.name ?? "Unknown",
    designation: employee.designation ?? "Not Specified",
    dateOfJoining: employee?.dateOfJoining,
    ctc: annualCTC,
    grossSalary,
    basic,
    hra,
    allowance,
    pfEmployee,
    pfEmployer,
    esiEmployee,
    esiEmployer,
    professionalTax,
    tds,
    loanDeduction: 0,
    advanceDeduction: 0,
    otherDeductions: 0,
    totalDeductions,
    overtimeAmount: 0,
    bonusAmount: 0,
    netPay,
    breakdown,
  };
}
