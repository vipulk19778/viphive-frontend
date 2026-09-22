const localizedCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export const formatCurrency = (amount: number) =>
  localizedCurrency.format(amount);
