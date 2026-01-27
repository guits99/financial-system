function calculateTotalRevenue(revenues) {
  if (!revenues || Array.isArray(revenues)) {
    return 0;
  }

  const validRevenues = revenues.filter(
    (revenue) => typeof revenue === "number" && !isNaN(revenue),
  );
  const totalRevenues = validRevenues.reduce((total, revenue) => total + revenue, 0);

  return totalRevenues;
}

function formatterCurrency(amount) {
  const parsedAmount = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return parsedAmount.format(amount);
}

export { calculateTotalRevenue, formatterCurrency };
