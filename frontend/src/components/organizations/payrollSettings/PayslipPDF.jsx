import {
  Document, Page, Text, View, StyleSheet, Image, Font,
} from "@react-pdf/renderer";

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 48,
    color: "#111",
    backgroundColor: "#fff",
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 64,
    height: 64,
    objectFit: "contain",
    marginBottom: 6,
  },
  orgName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  orgAddress: {
    fontSize: 8,
    color: "#555",
    textAlign: "center",
    lineHeight: 1.5,
  },
  title: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 10,
  },

  // Info grid (2 columns)
  infoGrid: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 16,
  },
  infoCol: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoLabel: {
    width: 80,
    color: "#555",
  },
  infoColon: {
    width: 12,
    color: "#555",
  },
  infoValue: {
    flex: 1,
    fontFamily: "Helvetica-Bold",
  },

  // Table
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e8e8e8",
    borderWidth: 1,
    borderColor: "#bbb",
  },
  tableRow: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#bbb",
  },
  tableRowAlt: {
    backgroundColor: "#fafafa",
  },
  colEarningsLabel: { width: "35%", padding: 5, borderRightWidth: 1, borderColor: "#bbb" },
  colEarningsAmt:   { width: "15%", padding: 5, textAlign: "right", borderRightWidth: 1, borderColor: "#bbb" },
  colDeductLabel:   { width: "35%", padding: 5, borderRightWidth: 1, borderColor: "#bbb" },
  colDeductAmt:     { width: "15%", padding: 5, textAlign: "right" },
  headerText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  totalRow: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#bbb",
    backgroundColor: "#f0f0f0",
  },
  totalLabel: {
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },

  // Net pay words
  netPaySection: {
    alignItems: "center",
    marginVertical: 14,
  },
  netPayAmount: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  netPayWords: {
    fontSize: 9,
    color: "#444",
    marginTop: 2,
  },

  // Signatures
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 8,
  },
  signatureBlock: {
    width: "40%",
  },
  signatureLabel: {
    fontSize: 9,
    marginBottom: 20,
    color: "#444",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },

  // Footer
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#888",
    fontStyle: "italic",
  },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n ?? 0);

const displayMonth = (m) => {
  if (!m) return "";
  const [year, month] = m.split("-");
  return new Date(year, month - 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
};

// Very basic number-to-words (handles up to lakhs — sufficient for Indian payslips)
function toWords(num) {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num === 0) return "Zero";

  function helper(n) {
    if (n === 0) return "";
    if (n < 20) return ones[n] + " ";
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "") + " ";
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred " + helper(n % 100);
    if (n < 100000) return helper(Math.floor(n / 1000)) + "Thousand " + helper(n % 1000);
    if (n < 10000000) return helper(Math.floor(n / 100000)) + "Lakh " + helper(n % 100000);
    return helper(Math.floor(n / 10000000)) + "Crore " + helper(n % 10000000);
  }

  return helper(Math.round(num)).trim();
}

// ─── PDF Document ─────────────────────────────────────────────────────────────

const PayslipPDF = ({ payslip, org }) => {
  const earnings = [
    { label: "Basic Salary", amount: payslip.basic },
    { label: "House Rent Allowance", amount: payslip.hra },
    { label: "Allowance", amount: payslip.allowance },
    ...(payslip.overtimeAmount > 0 ? [{ label: "Overtime", amount: payslip.overtimeAmount }] : []),
    ...(payslip.bonusAmount > 0 ? [{ label: "Bonus", amount: payslip.bonusAmount }] : []),
  ];

  const deductions = [
    ...(payslip.pfEmployee > 0 ? [{ label: "Provident Fund", amount: payslip.pfEmployee }] : []),
    ...(payslip.esiEmployee > 0 ? [{ label: "ESI", amount: payslip.esiEmployee }] : []),
    ...(payslip.professionalTax > 0 ? [{ label: "Professional Tax", amount: payslip.professionalTax }] : []),
    ...(payslip.tds > 0 ? [{ label: "TDS / Income Tax", amount: payslip.tds }] : []),
    ...(payslip.loanDeduction > 0 ? [{ label: "Loan", amount: payslip.loanDeduction }] : []),
    ...(payslip.advanceDeduction > 0 ? [{ label: "Advance", amount: payslip.advanceDeduction }] : []),
  ];

  // Pad both arrays to same length for the side-by-side table
  const maxRows = Math.max(earnings.length, deductions.length);
  while (earnings.length < maxRows) earnings.push(null);
  while (deductions.length < maxRows) deductions.push(null);

  const orgAddress = [org?.city, org?.state, org?.country]
    .filter(Boolean).join(", ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Header ── */}
        <View style={styles.header}>
          {org?.logo && (
            <Image style={styles.logo} src={org.logo} />
          )}
          <Text style={styles.title}>Payslip</Text>
          <Text style={styles.orgName}>{org?.org?.name ?? ""}</Text>
          {org?.address && (
            <Text style={styles.orgAddress}>{org.address}</Text>
          )}
          {orgAddress && (
            <Text style={styles.orgAddress}>{orgAddress}</Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* ── Employee Info ── */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Joining</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{payslip.user?.dateOfJoining ?? "—"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Pay Period</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{displayMonth(payslip.month)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Worked Days</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{payslip.workedDays ?? 26}</Text>
            </View>
          </View>

          <View style={styles.infoCol}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employee Name</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{payslip.employeeName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Designation</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{payslip.designation}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Earnings / Deductions Table ── */}
        <View style={styles.table}>
          {/* Table header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.colEarningsLabel, styles.headerText]}>Earnings</Text>
            <Text style={[styles.colEarningsAmt, styles.headerText]}>Amount</Text>
            <Text style={[styles.colDeductLabel, styles.headerText]}>Deductions</Text>
            <Text style={[styles.colDeductAmt, styles.headerText]}>Amount</Text>
          </View>

          {/* Rows */}
          {earnings.map((earn, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={styles.colEarningsLabel}>{earn?.label ?? ""}</Text>
              <Text style={styles.colEarningsAmt}>{earn ? fmt(earn.amount) : ""}</Text>
              <Text style={styles.colDeductLabel}>{deductions[i]?.label ?? ""}</Text>
              <Text style={styles.colDeductAmt}>{deductions[i] ? fmt(deductions[i].amount) : ""}</Text>
            </View>
          ))}

          {/* Totals row */}
          <View style={styles.totalRow}>
            <Text style={[styles.colEarningsLabel, styles.totalLabel]}>Total Earnings</Text>
            <Text style={[styles.colEarningsAmt, styles.totalLabel]}>{fmt(payslip.grossSalary)}</Text>
            <Text style={[styles.colDeductLabel, styles.totalLabel]}>Total Deductions</Text>
            <Text style={[styles.colDeductAmt, styles.totalLabel]}>{fmt(payslip.totalDeductions)}</Text>
          </View>

          {/* Net pay row */}
          <View style={styles.totalRow}>
            <Text style={styles.colEarningsLabel}></Text>
            <Text style={styles.colEarningsAmt}></Text>
            <Text style={[styles.colDeductLabel, styles.totalLabel]}>Net Pay</Text>
            <Text style={[styles.colDeductAmt, styles.totalLabel]}>{fmt(payslip.netPay)}</Text>
          </View>
        </View>

        {/* ── Net Pay in Words ── */}
        <View style={styles.netPaySection}>
          <Text style={styles.netPayAmount}>{fmt(payslip.netPay)}</Text>
          <Text style={styles.netPayWords}>{toWords(payslip.netPay)} Only</Text>
        </View>

        <View style={styles.divider} />

        {/* ── Signatures ── */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Employer Signature</Text>
            <View style={styles.signatureLine} />
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Employee Signature</Text>
            <View style={styles.signatureLine} />
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>This is a system generated payslip</Text>
        </View>

      </Page>
    </Document>
  );
};

export default PayslipPDF;
