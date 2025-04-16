import { Card } from "@/ui/card";
import { TransactionForm } from "@/pages/TransactionForm";
import { TransactionList } from "@/pages/TransactionList";
import { MonthlyExpensesChart } from "@/pages/MonthlyExpensesChart";
import { Transaction } from "@/App";
import supabase from '@/lib/supabaseClient';
import { useEffect } from "react";
import { toast } from 'react-hot-toast';


interface HomeProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

function Home({ transactions, setTransactions }: HomeProps) {
  const fetchTransactions = async () => {
    const { data, error } = await supabase.from('transactions').select('*');
    if (error) {
      console.error(error);
    } else {
      setTransactions(data || []);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    const { error } = await supabase.from('transactions').insert([transaction]);
    if (error) {
      toast.error("Failed to add transaction");
      console.error(error);
    } else {
      toast.success("Transaction added");
      fetchTransactions();
    }
  };
  
  const editTransaction = async (transaction: Transaction) => {
    const { error } = await supabase.from('transactions')
      .update(transaction)
      .eq('id', transaction.id);
  
    if (error) {
      toast.error("Failed to update transaction");
      console.error(error);
    } else {
      toast.success("Transaction updated");
      fetchTransactions();
    }
  };
  
  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      toast.error("Failed to delete transaction");
      console.error(error);
    } else {
      toast.success("Transaction deleted");
      fetchTransactions();
    }
  };
  

  return (
    <div className="mx-auto max-w-7xl mt-5 space-y-8 p-4 md:p-8">
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
          transactions={transactions}
          onEdit={editTransaction}
          onDelete={deleteTransaction}
        />
      </Card>
    </div>
  );
}

export default Home;
