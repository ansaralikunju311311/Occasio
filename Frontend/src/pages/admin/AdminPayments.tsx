import { useState } from 'react';
import { Table } from '../../components/common/Table';
import { Pagination } from '../../components/common/Pagination';
import { usePaymentHistory } from '../../hooks/useAdmin';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface Payment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  eventId?: {
    _id: string;
    title: string;
  };
  purpose: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  createdAt: string;
}

const AdminPayments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: responseData,
    isLoading,
    error,
  } = usePaymentHistory({ page: currentPage, limit: itemsPerPage });

  const payments = responseData?.payments || [];
  const metadata = responseData?.metadata;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPurposeBadgeColor = (purpose: string) => {
    switch (purpose?.toUpperCase()) {
      case 'EVENT_PUBLISH':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BOOKING':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'SUBSCRIPTION':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payment History</h1>
          <p className="text-sm text-gray-500 mt-1">
            View all transactions, including event scheduling fees, bookings, and subscriptions.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {error instanceof Error ? error.message : String(error)}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table
          columns={[
            { header: 'Transaction ID' },
            { header: 'User' },
            { header: 'Purpose' },
            { header: 'Amount' },
            { header: 'Status' },
            { header: 'Date' },
          ]}
          data={payments}
          emptyState={
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="h-12 w-12 text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <p className="text-base font-medium text-gray-900">No payments found</p>
                  <p className="text-sm mt-1">
                    There are currently no transactions recorded on the platform.
                  </p>
                </div>
              </td>
            </tr>
          }
          renderRow={(payment: Payment) => (
            <tr key={payment._id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded border border-gray-200 inline-block">
                  {payment.transactionId}
                </div>
                <div className="text-xs text-gray-500 mt-1">Method: {payment.paymentMethod}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {payment.userId?.name || 'Unknown'}
                </div>
                <div className="text-sm text-gray-500">{payment.userId?.email || ''}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPurposeBadgeColor(
                    payment.purpose
                  )}`}
                >
                  {payment.purpose?.replace('_', ' ')}
                </span>
                {payment.eventId && (
                  <div className="text-xs text-gray-500 mt-1 truncate max-w-37.5">
                    Event: {payment.eventId.title}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {payment.currency === 'INR' ? '₹' : payment.currency}{' '}
                {payment.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                    payment.paymentStatus
                  )}`}
                >
                  {payment.paymentStatus}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
            </tr>
          )}
        />

        {/* Pagination Section */}
        {metadata && metadata.total > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={metadata.totalPages}
            totalItems={metadata.total}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
