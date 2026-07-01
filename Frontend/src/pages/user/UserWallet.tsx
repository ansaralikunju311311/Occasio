import { useState } from 'react';
import { useAppSelector } from '../../redux/hook';
import { useWalletHistory } from '../../hooks/useUser';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Pagination } from '../../components/common/Pagination';

const UserWallet = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { user } = useAppSelector((state) => state.auth);
  const { data: historyData, isLoading, error } = useWalletHistory(currentPage, itemsPerPage);

  const transactions = historyData?.data || [];
  const metadata = historyData?.metadata;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Digital Wallet</h1>
          <p className="text-slate-400 mt-1">
            Track your balance, refunds, and ticket transactions.
          </p>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900/40 border border-indigo-500/20 rounded-2xl flex items-center justify-between shadow-lg backdrop-blur-md max-w-2xl">
        <div className="space-y-1">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Current Balance</span>
          <h3 className="text-4xl font-black text-white">₹{user?.walletBalance ?? 0}</h3>
          <p className="text-[10px] text-slate-400">
            Refunds from cancelled events are automatically credited here.
          </p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl text-indigo-400">
          💳
        </div>
      </div>

      <div className="bg-[#0a0f16] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 w-full">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Transaction History</h2>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
            Error loading transaction history.
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No wallet transactions found.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-4">Event Details</th>
                    <th className="pb-3 px-4">Transaction ID</th>
                    <th className="pb-3 px-4">Booking ID</th>
                    <th className="pb-3 px-4">Date & Time</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transactions.map((tx: any) => {
                    const isRefund = tx.purpose === 'REFUND';
                    return (
                      <tr key={tx.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">
                            {tx.eventId?.title || 'Cancelled Event'}
                          </div>
                          <div className="text-xs text-slate-500">
                            {isRefund ? 'Event Cancellation Refund' : 'Ticket Booking Purchase'}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-300">
                          {tx.transactionId}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-300">
                          {tx.bookingId || 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-300">
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : 'N/A'}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              isRefund
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                          >
                            {isRefund ? 'CREDIT' : 'DEBIT'}
                          </span>
                        </td>
                        <td className={`py-4 px-4 text-right font-bold text-base ${isRefund ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isRefund ? '+' : '-'}₹{tx.amount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {metadata && metadata.total > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={metadata.totalPages}
                totalItems={metadata.total}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserWallet;
