
import dayjs from "dayjs";

const DAY_MAP = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

function countWorkingDays(startDate, endDate, weekendDays = []) {
  const weekendNums = weekendDays.map(d => DAY_MAP[d.toLowerCase()]);
  let count = 0;
  let cursor = dayjs(startDate);
  const end  = dayjs(endDate);

  while (cursor.isSame(end, "day") || cursor.isBefore(end, "day")) {
    if (!weekendNums.includes(cursor.day())) count++;
    cursor = cursor.add(1, "day");
  }
  return count;
}

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

export function calculateEmployeePayroll(employee, settings, taxConfig = null, period = null) {
  const annualCTC  = employee.ctc ?? 0;
  const monthlyCTC = annualCTC / 12;

  // ✅ NEW — proration factor
  let proratedBase = monthlyCTC;
  let workingDaysInPeriod = null;

  if (settings.payrollCycle !== "monthly" && period) {
    workingDaysInPeriod = countWorkingDays(period.startDate, period.endDate, settings.weekendDays);
    proratedBase = (monthlyCTC / settings.workingDaysPerMonth) * workingDaysInPeriod;
  }

  // --- Gross earnings breakdown ---
  // ✅ CHANGED — monthlyCTC → proratedBase
  const basic     = Math.round((proratedBase * settings.basicPercent) / 100);
  const hra       = Math.round((basic * settings.hraPercent) / 100);
  const allowance = proratedBase - (basic + hra);
  const grossSalary = basic + hra + allowance;

  // --- PF ---
  // ✅ CHANGED — pfCeiling prorated for non-monthly
  let pfEmployee = 0;
  let pfEmployer = 0;
  if (settings.pfEnabled) {
    const pfCeiling = settings.payrollCycle === "monthly"
      ? settings.pfCeiling
      : (settings.pfCeiling / settings.workingDaysPerMonth) * workingDaysInPeriod;

    const pfBase = Math.min(basic, pfCeiling);
    pfEmployee = Math.round((pfBase * settings.pfPercent) / 100);
    pfEmployer = Math.round((pfBase * settings.pfEmployerContribution) / 100);
  }

  // --- ESI ---
  // ✅ CHANGED — esiCeiling prorated for non-monthly
  let esiEmployee = 0;
  let esiEmployer = 0;
  const esiCeiling = settings.payrollCycle === "monthly"
    ? settings.esiCeiling
    : (settings.esiCeiling / settings.workingDaysPerMonth) * workingDaysInPeriod;

  if (settings.esiEnabled && grossSalary <= esiCeiling) {
    esiEmployee = Math.round((grossSalary * settings.esiPercent) / 100);
    esiEmployer = Math.round((grossSalary * settings.esiEmployerPercent) / 100);
  }

  // --- Professional Tax ---
  // ✅ CHANGED — prorated for non-monthly (PT is normally a flat monthly amount)
  let professionalTax = 0;
  if (settings.professionalTaxEnabled) {
    professionalTax = settings.payrollCycle === "monthly"
      ? settings.professionalTaxAmount
      : Math.round((settings.professionalTaxAmount / settings.workingDaysPerMonth) * workingDaysInPeriod);
  }

  // --- Gratuity ---
  // ✅ CHANGED — basic is already prorated, so this naturally scales
  let gratuity = 0;
  if (settings?.gratuityEnabled) {
    gratuity = Math.round((basic * 4.8) / 100);
  }

  // --- TDS ---
  // ✅ CHANGED — calculate monthly TDS first, then prorate for non-monthly
  let tds = 0;
  if (settings.tdsEnabled && taxConfig) {
    const monthlyTds = calculateTDS(
      annualCTC,
      taxConfig.standardDeduction,
      taxConfig.slabs,
      taxConfig.cessPercentage,
      taxConfig?.rebateLimit
    );

    tds = settings.payrollCycle === "monthly"
      ? monthlyTds
      : Math.round((monthlyTds / settings.workingDaysPerMonth) * workingDaysInPeriod);
  }

  // --- Total deductions (employee side only) ---
  const totalDeductions = pfEmployee + esiEmployee + professionalTax + tds;

  // --- Net pay ---
  const netPay = grossSalary - totalDeductions;

  const breakdown = {
    annualCTC,
    monthlyCTC,
    payrollCycle: settings.payrollCycle,          // ✅ NEW
    periodStart:  period?.startDate ?? null,      // ✅ NEW
    periodEnd:    period?.endDate ?? null,        // ✅ NEW
    workingDaysInPeriod,                          // ✅ NEW
    proratedBase,                                 // ✅ NEW
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
