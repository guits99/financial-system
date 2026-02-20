const inputAmount = document.getElementById("amount");
const inputTitle = document.getElementById("title");
const inputType = document.getElementById("type");
const inputDate = document.getElementById("date");
const addTransactionButton = document.getElementById("add-transaction-button");
const saveEditedTransactionButton = document.getElementById(
  "save-edited-transaction-button"
);
const cancelEditTransactionButton = document.getElementById(
  "cancel-edit-transaction-button"
);

const transactionsList = document.getElementById("transactions");

const TRANSACTION_STORAGE_KEY = "transactions";

let isEdit = false;
let editTransactionId = null;

// function calculateTotalRevenue(revenues) {
//   if (!revenues || Array.isArray(revenues)) {
//     return 0;
//   }

//   const validRevenues = revenues.filter(
//     (revenue) => typeof revenue === "number" && !isNaN(revenue)
//   );
//   const totalRevenues = validRevenues.reduce(
//     (total, revenue) => total + revenue,
//     0
//   );

//   return totalRevenues;
// }

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

function saveTransactionEdited() {
  const transactions = retrieveTransactionsFromStorage();

  const type = inputType.value;
  const amount = parseFloat(inputAmount.value);
  const title = inputTitle.value.trim();
  const date = inputDate.value;

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

  if (!date) {
    alert("Por favor, coloque a data de nascimento.");
    return;
  }

  const id = Number(editTransactionId);

  const transactionToEdit = transactions.find(
    (transaction) => transaction.id === id
  );

  if (!transactionToEdit) {
    alert("Transação não encontrada.");
    return;
  }

  transactionToEdit.title = title;
  transactionToEdit.amount = amount;
  transactionToEdit.type = type;
  transactionToEdit.date = date;

  saveTransactionsInStorage(transactions);

  isEdit = false;
  editTransactionId = null;

  inputTitle.value = "";
  inputAmount.value = "";
  inputType.value = "";
  inputDate.value = "";

  addTransactionButton.style.display = "block";
  saveEditedTransactionButton.style.display = "none";
  cancelEditTransactionButton.style.display = "none";

  listTransactions();
}

function cancelEditTransaction() {
  isEdit = false;

  inputTitle.value = "";
  inputAmount.value = "";
  inputType.value = "";
  inputDate.value = "";

  addTransactionButton.style.display = "block";
  saveEditedTransactionButton.style.display = "none";
  cancelEditTransactionButton.style.display = "none";
}

function editTransactionById(transactionID) {
  const transactions = retrieveTransactionsFromStorage();

  const id = Number(transactionID);

  const findedTransaction = transactions.find(
    (transaction) => transaction.id === id
  );

  if (!findedTransaction) {
    alert("Não foi possivel encontrar a transação.");
    return;
  }

  isEdit = true;
  editTransactionId = id;

  inputTitle.value = findedTransaction.title;
  inputAmount.value = findedTransaction.amount;
  inputType.value = findedTransaction.type;
  inputDate.value = findedTransaction.date;

  addTransactionButton.style.display = "none";
  saveEditedTransactionButton.style.display = "block";
  cancelEditTransactionButton.style.display = "block";
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
                <strong>${transaction.date}</strong>
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
  const date = inputDate.value;

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

  if (!date) {
    alert("Por favor, coloque a data de nascimento.");
    return;
  }

  const transactions = retrieveTransactionsFromStorage();

  transactions.push({
    id: Date.now(),
    type,
    amount,
    title,
    date,
  });

  saveTransactionsInStorage(transactions);

  inputAmount.value = "";
  inputTitle.value = "";
  inputDate.value = "";

  listTransactions();
}

document.addEventListener("DOMContentLoaded", () => {
  listTransactions();
});
