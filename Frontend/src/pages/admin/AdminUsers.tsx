import { useState } from 'react';
import { createPortal } from 'react-dom';
import { api } from '../../services/api';
import { UpgradeStatus } from '../../types/upgrade-status.enum';
import { toast } from 'sonner';
import { Table } from '../../components/common/Table';
import { SearchBar } from '../../components/common/SearchBar';

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  isEventManger: boolean;
  createdAt?: string;
  applyingupgrade?: UpgradeStatus;
  rejectedAt?: Date | null;
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  const {
    data: users = [],
    isLoading: loading,
    error,
  } = useQuery<User[]>({
    queryKey: ['adminUsers', searchTerm],
    queryFn: async () => {
      const response = await api.get('/admin/users', {
        params: { search: searchTerm },
      });
      const usersData = (
        Array.isArray(response.data)
          ? response.data
          : response.data?.users || response.data?.data || []
      ) as User[];
      return usersData.filter((user) => user.role === 'USER');
    },
  });

  const blockMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      api.patch(`/admin/blockorunblock/${userId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('User status updated successfully.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user status.');
    },
  });

  const detailsMutation = useMutation({
    mutationFn: (userId: string) => api.get(`/admin/userDetails/${userId}`),
    onSuccess: (response) => {
      const userData = response.data?.user || response.data?.data || response.data;
      setSelectedUser(userData);
      setIsDetailsModalOpen(true);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to load user details.');
    },
  });

  const handleUser = async (userId: string, userStatus: string) => {
    const newstatus = userStatus === 'ACTIVE' ? 'BLOCK' : 'ACTIVE';
    blockMutation.mutate({ userId, status: newstatus });
  };

  const detailsView = (userId: string) => {
    detailsMutation.mutate(userId);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUser(null);
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'BLOCK':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'EVENT_MANAGER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Users Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage all registered users on the platform.
          </p>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
        />
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
            { header: 'User Details' },
            { header: 'Role' },
            { header: 'Status' },
            { header: 'Verified' },
            {
              header: 'Actions',
              className:
                'px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider',
            },
          ]}
          data={users}
          emptyState={
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="h-12 w-12 text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <p className="text-base font-medium text-gray-900">No users found</p>
                  <p className="text-sm mt-1">
                    There are currently no users registered on the platform.
                  </p>
                </div>
              </td>
            </tr>
          }
          renderRow={(user, index) => {
            const userId = user._id || user.id || index.toString();
            return (
              <tr key={userId} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-linear-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-sm">
                        {getInitials(user.name)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}
                  >
                    {user.role?.replace('_', ' ') || 'USER'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(user.status)}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full mr-1.5 ${user.status?.toUpperCase() === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'}`}
                    ></span>
                    {user.status || 'UNKNOWN'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isVerified ? (
                    <div className="flex items-center text-green-600 bg-green-50 px-2.5 py-1 rounded-md w-fit border border-green-100">
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-md w-fit border border-yellow-100">
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span className="text-xs font-medium">Pending</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors duration-150 mr-2"
                    onClick={() => detailsView(userId)}
                  >
                    View
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors duration-150"
                    onClick={() => handleUser(userId, user.status)}
                  >
                    {user.status?.toUpperCase() === 'ACTIVE' ? 'Block' : 'Unblock'}
                  </button>
                </td>
              </tr>
            );
          }}
        />

        {/* Pagination Section (Static for now) */}
        {users.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{' '}
                  <span className="font-medium">{users.length}</span> of{' '}
                  <span className="font-medium">{users.length}</span> results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {isDetailsModalOpen &&
        selectedUser &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
            onClick={closeDetailsModal}
          >
            <div
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative p-6 border-b border-gray-100">
                <button
                  onClick={closeDetailsModal}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-full bg-linear-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {getInitials(selectedUser.name)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {selectedUser.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                      Email Identifier
                    </label>
                    <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      {selectedUser.email}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                      Role
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeColor(selectedUser.role)}`}
                    >
                      {selectedUser.role?.replace('_', ' ') || 'USER'}
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(selectedUser.status)}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full mr-1.5 ${selectedUser.status?.toUpperCase() === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'}`}
                      ></span>
                      {selectedUser.status || 'UNKNOWN'}
                    </span>
                  </div>

                  {/* <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">User ID</label>
                  <div className="text-[10px] font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100 truncate">
                    {selectedUser._id || selectedUser.id || "N/A"}
                  </div>
                </div> */}

                  {/* <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Joined On</label>
                  <div className="text-sm font-medium text-gray-700">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"}
                  </div>
                </div> */}

                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                      Verified Member
                    </label>
                    {selectedUser.isVerified ? (
                      <div className="flex items-center text-green-600 font-semibold text-sm">
                        <svg
                          className="w-5 h-5 mr-1 bg-green-100 rounded-full p-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                          />
                        </svg>
                        Verified
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-600 font-semibold text-sm">
                        <svg
                          className="w-5 h-5 mr-1 bg-yellow-100 rounded-full p-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                          />
                        </svg>
                        Pending
                      </div>
                    )}
                  </div>

                  {selectedUser.applyingupgrade &&
                    selectedUser.applyingupgrade !== UpgradeStatus.NONE && (
                      <div>
                        <label className="text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-1">
                          Upgrade Status
                        </label>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${
                            selectedUser.applyingupgrade === UpgradeStatus.PENDING
                              ? 'bg-amber-100 text-amber-700 border-amber-200'
                              : selectedUser.applyingupgrade === UpgradeStatus.REJECTED
                                ? 'bg-rose-100 text-rose-700 border-rose-200'
                                : 'bg-blue-100 text-blue-700 border-blue-200'
                          }`}
                        >
                          {selectedUser.applyingupgrade === UpgradeStatus.PENDING
                            ? 'PENDING APPROVAL'
                            : selectedUser.applyingupgrade === UpgradeStatus.REJECTED
                              ? 'REJECTED'
                              : 'APPROVED'}
                        </span>
                      </div>
                    )}

                  {selectedUser.isEventManger && (
                    <div className="col-span-2 mt-2">
                      <div className="bg-blue-50 text-blue-700 p-3 rounded-xl border border-blue-100 flex items-start space-x-3">
                        <svg
                          className="w-5 h-5 text-blue-500 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          Authorized Event Manager with elevated platform permissions.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button
                  onClick={closeDetailsModal}
                  className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-100 hover:border-gray-400 transition-all shadow-sm active:scale-95"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default AdminUsers;
