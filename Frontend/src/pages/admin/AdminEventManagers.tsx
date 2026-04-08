import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { api } from '../../services/api';
import { toast } from 'sonner';
import { Table } from '../../components/common/Table';
import { SearchBar } from '../../components/common/SearchBar';
interface EventManager {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  isEventManger: boolean;
}

const AdminEventManagers = () => {
  const [managers, setManagers] = useState<EventManager[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedManager, setSelectedManager] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchManagers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/users', {
        params: {
          search: searchQuery,
        },
      });

      console.log('console.log', response);
      const usersData: any[] = Array.isArray(response.data)
        ? response.data
        : response.data?.users || response.data?.data || [];

      const eventManagersData = usersData.filter(
        (user) => user.role === 'EVENT_MANAGER' || user.isEventManger === true
      );

      setManagers(eventManagersData);
    } catch (err: any) {
      console.error('Failed to fetch event managers:', err);
      setError(
        err?.response?.data?.message || 'Failed to load event managers. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchManagers();
    }, 1000);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleManager = async (userId: string, status: string) => {
    const newstatus = status === 'ACTIVE' ? 'BLOCK' : 'ACTIVE';

    setManagers((prevManagers) =>
      prevManagers.map((manager) =>
        (manager._id || manager.id) === userId ? { ...manager, status: newstatus } : manager
      )
    );

    try {
      await api.patch(`/admin/blockorunblock/${userId}`, {
        status: newstatus,
      });
    } catch (error: any) {
      console.error('Failed to block/unblock manager:', error);
      toast.error(error.response?.data?.message || 'Failed to update manager status.');
      // Revert UI on failure
      setManagers((prevManagers) =>
        prevManagers.map((manager) =>
          (manager._id || manager.id) === userId ? { ...manager, status: status } : manager
        )
      );
    }
  };

  const detailView = async (id: string, email: string) => {
    try {
      const response = await api.get(`/admin/managerDetails/${id}`);
      const managerData = response.data?.manager || response.data?.data || response.data;

      if (managerData) {
        setSelectedManager({ ...managerData, authEmail: email });
        setIsDetailsModalOpen(true);
      }
    } catch (error: any) {
      console.error('Failed to fetch manager details:', error);
      toast.error(error.response?.data?.message || 'Failed to load manager details.');
    }
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedManager(null);
  };

  const isImageFile = (url: string) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return (
      lowerUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) !== null ||
      lowerUrl.includes('cloudinary.com/dliraelbo/image/upload')
    );
  };

  const getInitials = (name: string) => {
    if (!name) return 'E';
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800 border-red-200';
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Event Managers</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage approved Event Managers on the platform.
          </p>
        </div>

        {/* Search bar */}
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search event managers..."
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table
          theadClassName="bg-gray-50 border-b border-gray-200"
          tbodyClassName="bg-white divide-y divide-gray-100"
          columns={[
            { header: 'Manager Details' },
            { header: 'Status' },
            { header: 'Verified' },
            {
              header: 'Actions',
              className:
                'px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider',
            },
          ]}
          data={managers}
          emptyState={
            <tr>
              <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="h-16 w-16 text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-lg font-medium text-gray-900">No event managers found</p>
                  <p className="text-sm mt-1 text-gray-500">
                    There are currently no approved event managers on the platform.
                  </p>
                </div>
              </td>
            </tr>
          }
          renderRow={(manager, index) => {
            console.log('checking', manager);
            const managerId = manager._id || manager.id || index.toString();

            return (
              <tr key={managerId} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-sm">
                        {getInitials(manager.name)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {manager.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">{manager.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(manager.status)}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full mr-1.5 ${manager.status?.toUpperCase() === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'}`}
                    ></span>
                    {manager.status || 'UNKNOWN'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {manager.isVerified ? (
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
                    onClick={() => detailView(managerId, manager.email)}
                  >
                    View
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors duration-150"
                    onClick={() => handleManager(managerId, manager.status)}
                  >
                    {manager.status?.toUpperCase() === 'ACTIVE' ? 'Block' : 'Unblock'}
                  </button>
                </td>
              </tr>
            );
          }}
        />
      </div>

      {/* Manager Details Modal */}
      {isDetailsModalOpen &&
        selectedManager &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
            onClick={closeDetailsModal}
          >
            <div
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative p-6 border-b border-gray-100 shrink-0">
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
                  <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {getInitials(
                      selectedManager.fullName || selectedManager.organizationName || 'M'
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {selectedManager.fullName || selectedManager.organizationName || 'Manager'}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">{selectedManager.authEmail}</p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Organization Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 border-b pb-2">
                    Organization Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                        Organization Name
                      </label>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedManager.organizationName || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                        Organization Type
                      </label>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedManager.organizationType || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Experience & Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 border-b pb-2">
                    Experience & Qualifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                        Experience Level
                      </label>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {selectedManager.experienceLevel || 'N/A'}
                      </span>
                    </div>
                    {selectedManager.documentReference && (
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                          Document
                        </label>
                        <a
                          href={selectedManager.documentReference}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          View Document
                        </a>
                      </div>
                    )}
                    {selectedManager.socialLinks && (
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                          Social Links
                        </label>
                        <a
                          href={selectedManager.socialLinks}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                          Social Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Certificate Preview */}
                {selectedManager.certificate && (
                  <div className="space-y-4 mt-6">
                    <h4 className="text-sm font-bold text-gray-900 border-b pb-2">
                      Certificate Preview
                    </h4>
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-blue-200 transition-all">
                      {isImageFile(selectedManager.certificate) ? (
                        <div className="space-y-3">
                          <img
                            src={selectedManager.certificate}
                            alt="Certificate"
                            className="w-full h-auto max-h-64 object-contain rounded-lg shadow-sm border border-gray-100 bg-white"
                          />
                          <a
                            href={selectedManager.certificate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            View Full Resolution
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 truncate mr-2">
                            {selectedManager.certificate || 'Not provided'}
                          </span>
                          <a
                            href={selectedManager.certificate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* About Events */}
                {selectedManager.aboutEvents && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-900 border-b pb-2">About Events</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">
                      {selectedManager.aboutEvents}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
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

export default AdminEventManagers;
