import { useState } from "react";
import { Card } from "@/ui/card";
import { TransactionForm } from "@/pages/TransactionForm";
import { TransactionList } from "@/pages/TransactionList";
import { MonthlyExpensesChart } from "@/pages/MonthlyExpensesChart";
import { Transaction } from "@/App";

 function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    setTransactions([
      ...transactions,
      { ...transaction, id: crypto.randomUUID() },
    ]);
  };

  const editTransaction = (transaction: Transaction) => {
    setTransactions(
      transactions.map((t) => (t.id === transaction.id ? transaction : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div className="mx-auto max-w-7xl mt-10 space-y-8 p-4 md:p-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-6 text-2xl font-semibold">Add Transaction</h2>
          <TransactionForm onSubmit={addTransaction} />
        </Card>

        <Card className="p-6">
          <h2 className="mb-6 text-2xl font-semibold">Monthly Expenses</h2>
          <MonthlyExpensesChart transactions={transactions} />
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-6 text-2xl font-semibold">Transaction History</h2>
        <TransactionList
          transactions={transactions} onEdit={editTransaction}
          onDelete={deleteTransaction}
        />
      </Card>
    </div>
  );
}
export default Home;