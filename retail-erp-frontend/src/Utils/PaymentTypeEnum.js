export const PaymentTypeEnum = {
  1: "Online",
  2: "DD",
  3: "CM",
  4: "Cheque",
  5: "Replace",
  6: "Due Inv",
  7: "Hill Allowence",
  8: "City Allowence",
  9: "Dealer Incentive",
  10: "DSR Incentive",
  11: "DD Cost",
  12: "Sample",
  13: "Settlement",
};

export const getPaymentTypeLabel = (value) => {
  return PaymentTypeEnum[value] || "N/A";
};
