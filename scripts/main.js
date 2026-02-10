const inputAmount = document.getElementById("amount");
const inputTitle = document.getElementById("title");
const inputType = document.getElementById("type");
const transactionsList = document.getElementById("transactions");

const TRANSACTION_STORAGE_KEY = "transactions";

function calculateTotalRevenue(revenues) {
  if (!revenues || Array.isArray(revenues)) {
    return 0;
  }

  const validRevenues = revenues.filter(
    (revenue) => typeof revenue === "number" && !isNaN(revenue)
  );
  const totalRevenues = validRevenues.reduce(
    (total, revenue) => total + revenue,
    0
  );

  return totalRevenues;
}

function formatterCurrency(amount) {
  const parsedAmount = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return parsedAmount.format(amount);
}

function clearAllTransactionsInStorage() {
  localStorage.clear();
  listTransactions();
}

function saveTransactionsInStorage(transactions) {
  const parsedTransactions = JSON.stringify(transactions);

  localStorage.setItem(TRANSACTION_STORAGE_KEY, parsedTransactions);
}

function retrieveTransactionsFromStorage() {
  const transactionsJSON = localStorage.getItem(TRANSACTION_STORAGE_KEY);
  const parsedTransactions = JSON.parse(transactionsJSON);
  return parsedTransactions || [];
}

function editTransactionById(transactionID, newEditTransaction) {
  const transactions = retrieveTransactionsFromStorage();

  const findedTransaction = transactions.find((transaction) => {
    return transaction.id === transactionID;
  });

  console.log(findedTransaction);

  if (!findedTransaction) {
    alert("Não foi possivel encontrar a transação.");
    return;
  }

  findedTransaction.title = newEditTransaction;

  const parsedTransactions = JSON.stringify(transactions);
  localStorage.setItem(TRANSACTION_STORAGE_KEY, parsedTransactions);
}

function deleteTransactionById(transactionID) {
  const transactions = retrieveTransactionsFromStorage();

  const filteredTransactions = transactions.filter(
    (transaction) => transaction.id !== transactionID
  );

  const parsedTransactions = JSON.stringify(filteredTransactions);
  localStorage.setItem(TRANSACTION_STORAGE_KEY, parsedTransactions);

  listTransactions();
}

function listTransactions() {
  const transactions = retrieveTransactionsFromStorage();

  if (transactions.length === 0) {
    transactionsList.innerHTML = "<li>Nenhuma transação cadastrada ainda.</li>";
    return;
  }

  transactionsList.innerHTML = transactions.map((transaction) => {
    const typeLabel = transaction.type.includes("expense")
      ? "Despesa"
      : "Receita";

    const typeIndicator = transaction.type.includes("expense") ? "-" : "+";

    return `
            <li>
                <strong>${transaction.id}</strong>
                <strong>${transaction.title}</strong>
                <div>
                    <span>
                        Tipo: ${typeLabel}
                    </span>
                    <span>
                        Valor: ${typeIndicator}${formatterCurrency(transaction.amount)}
                    </span>
                    <button onclick="deleteTransactionById(${transaction.id})">delete
                    </button>
                    <button onclick="editTransactionById(${transaction.id})">edit
                    </button>
                </div>
            </li>
        `;
  });
}

function addTransaction() {
  const type = inputType.value;
  const amount = parseFloat(inputAmount.value);
  const title = inputTitle.value.trim();

  if (!title) {
    alert("Por favor, informe o titulo.");
    return;
  }

  if (!type) {
    alert("Por favor, informe o tipo.");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Por favor, informe um valor valido maior que 0.");
    return;
  }

  const transactions = retrieveTransactionsFromStorage();

  transactions.push({
    id: Date.now(),
    type,
    amount,
    title,
  });

  saveTransactionsInStorage(transactions);

  inputAmount.value = "";
  inputTitle.value = "";

  listTransactions();
}

document.addEventListener("DOMContentLoaded", () => {
  listTransactions();
});
