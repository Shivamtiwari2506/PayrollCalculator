/**
 * Pure payroll calculation logic — no DB calls here.
 * Takes employee + active payroll settings + tax slabs, returns a full breakdown.
 */

/**
 * Calculate income tax (TDS) for an employee's annual gross salary.
 * Uses the provided tax slabs (already fetched from DB).
 */
function calculateTDS(annualGross, standardDeduction, slabs, cessPercent) {
  const taxableIncome = Math.max(0, annualGross - standardDeduction);
  let tax = 0;

  for (const slab of slabs) {
    const min = slab.minIncome;
    const max = slab.maxIncome ?? Infinity;
    if (taxableIncome <= min) break;
    const taxable = Math.min(taxableIncome, max) - min;
    tax += (taxable * slab.rate) / 100;
  }

  const cess = (tax * cessPercent) / 100;
  const annualTax = tax + cess;
  return Math.round(annualTax / 12); // monthly TDS
}

/**
 * Main calculation function.
 *
 * @param {object} employee   - { id, name, designation, ctc }
 * @param {object} settings   - Active PayrollSettings record
 * @param {object|null} taxConfig - { standardDeduction, cessPercentage, slabs[] } or null if TDS disabled
 * @returns {object} Full per-employee payroll breakdown
 */
export function calculateEmployeePayroll(employee, settings, taxConfig = null) {
  const annualCTC = employee.ctc ?? 0;
  const monthlyCTC = annualCTC / 12;

  // --- Gross earnings breakdown ---
  const basic = Math.round((monthlyCTC * settings.basicPercent) / 100);
  const hra = Math.round((monthlyCTC * settings.hraPercent) / 100);
  const allowance = Math.round((monthlyCTC * settings.allowancePercent) / 100);
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

  // --- TDS ---
  let tds = 0;
  if (settings.tdsEnabled && taxConfig) {
    tds = calculateTDS(
      annualCTC,
      taxConfig.standardDeduction,
      taxConfig.slabs,
      taxConfig.cessPercentage
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
