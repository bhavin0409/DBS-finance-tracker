import { getAccountWithTransactions } from "@/actions/account";
import { Suspense } from "react";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation"; 
import { AccountChart } from "../_components/account-chart";

async function AccountContent({ accountId }) {
  const accountData = await getAccountWithTransactions(accountId);
  if (!accountData) {
    notFound();
  }
  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(parseFloat(account.balance))}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <Suspense fallback={<BarLoader width={"100%"} color="#9333ea" />}>
        <AccountChart transactions={transactions}/>
      </Suspense>

      {/* Transactions Table */}
      <TransactionTable transactions={transactions} />
    </div>
  );
}

export default async function AccountPage({ params }) {
  const { id } = await params; // Await params here to access id safely

  return (
    <Suspense fallback={<BarLoader width={"100%"} color="#9333ea" />}>
      <AccountContent accountId={id} />
    </Suspense>
  );
}
