import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

 const TransactionsContext = createContext<TransactionContextData>({} as TransactionContextData);

export interface Transaction {
  id: number;
  amount: number;
  title: string;
  category: string;
  createdAt: string;
  type: string;
}

export type TransactionInput = Omit<Transaction, "id" | "createdAt">;

interface TransactionContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

interface TransactionProviderProps {
  children: ReactNode;
}

export function TransactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api
      .get("transactions")
      .then(({ data }) => setTransactions(data.transactions));
  }, []);

  async function createTransaction(transactionInput: TransactionInput) {
    const {data:{transaction}} = await api.post("/transactions", {
        ...transactionInput,
        createdAt: new Date()
    });

    setTransactions([...transactions, transaction]);
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransaction(){
  const context = useContext(TransactionsContext);
  return context;
}
