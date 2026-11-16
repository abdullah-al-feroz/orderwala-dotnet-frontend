export const BusinessTypeEnum = {
  1: "Retail",
  2: "Commission",
  3: "Institute",
  4: "WholeSale",
  5: "Temporary",
  6: "Rdso",
  7: "Ho",
  8: "Sd",
};

export const getBusinessTypeLabel = (value) => {
  return BusinessTypeEnum[value] || "N/A";
};