import { useState, useEffect } from "react";
import { UpgradeStatus } from "../../types/upgrade-status.enum";



import { api } from "../../services/api";
import { toast } from "sonner";
import { Table } from "../../components/common/Table";
import { SearchBar } from "../../components/common/SearchBar";
interface PendingManager {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  status: string;
  createdAt?: string;
  applyingupgrade?: UpgradeStatus;
}

interface ManagerDetails {
  _id: string;
  userId: string;
  fullName: string;
  organizationName: string;
  organizationType: string;
  experienceLevel: string;
  aboutEvents: string;
  certificate: string;
  documentReference: string;
  socialLinks: string[];
}

const AdminPendingManagers = () => {
  const [managers, setManagers] = useState<PendingManager[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedManager, setSelectedManager] = useState<ManagerDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionId, setRejectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const response = await api.get("/admin/users");



        console.log("users are coming", response)

        const usersData: any[] = Array.isArray(response.data)
          ? response.data
          : (response.data?.users || response.data?.data || []);

        const pendingManagers = usersData.filter(
          (user) => user.applyingupgrade === UpgradeStatus.PENDING
        );


        console.log("pendingManager", pendingManagers)
        setManagers(pendingManagers);
      } catch (err: any) {
        console.error("Failed to fetch users:", err);
        toast.error("Failed to load pending managers list.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  const handleManagerDetails = async (userId: string) => {




    try {
      setFetchingDetails(true);
      const response = await api.get(`/admin/pendingmanagers/${userId}`);
      console.log("manager details get  for the checking purpose", response);

      // Extract the manager details object safely
      let details = response.data;
      if (details.data?.user) details = details.data.user;
      else if (details.user) details = details.user;
      else if (details.data) details = details.data;

      console.log("Extracted details:", details);

      if (typeof details.socialLinks === 'string') {
        details.socialLinks = details.socialLinks.split(',').map((s: string) => s.trim()).filter(Boolean);
      } else if (!Array.isArray(details.socialLinks)) {
        details.socialLinks = [];
      }

      setSelectedManager(details);
      setIsModalOpen(true);
    } catch (error: any) {
      console.error("Failed to fetch manager details:", error);
      toast.error(error.response?.data?.message || "Failed to load manager details.");
    } finally {
      setFetchingDetails(false);
    }
  };

  const handleApproval = async (id: string) => {
    try {
      const response = await api.patch(`admin/approval/${id}`);


      console.log(response);
      toast.success("Manager application approved successfully!");
      setManagers(prev => prev.filter(m => (m._id || m.id) !== id));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("Failed to approve manager application.");
    }
  };

  const handleRejection = async (id: string, reason?: string) => {
    try {
      const response = await api.patch(`admin/rejection/${id}`, { reason });
      console.log(response);

      toast.success("Manager application rejected.");
      setManagers(prev => prev.filter(m => (m._id || m.id) !== id));
      setIsModalOpen(false);
      setIsRejectionModalOpen(false);
      setRejectionReason("");
    } catch (error) {
      console.error("Rejection failed:", error);
      toast.error("Failed to reject manager application.");
    }
  };
  const getInitials = (name: string) => {
    if (!name) return "M";
    return name.substring(0, 2).toUpperCase();
  };

  const isImageFile = (url: string) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) !== null || lowerUrl.includes('cloudinary.com/dliraelbo/image/upload');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pending Event Managers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve user requests to become Event Managers.
          </p>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search pending managers..."
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table
          theadClassName="bg-gray-50 border-b border-gray-200"
          tbodyClassName="bg-white divide-y divide-gray-100"
          columns={[
            { header: "Manager Details" },
            { header: "Status" },
            { header: "Actions", className: "px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider" }
          ]}
          data={managers}
          emptyState={
            <tr>
              <td colSpan={3} className="px-6 py-16 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900">No pending requests</p>
                  <p className="text-sm mt-1 text-gray-500">There are currently no users waiting to be approved.</p>
                </div>
              </td>
            </tr>
          }
          renderRow={(manager, index) => {
            const managerId = manager._id || manager.id || index.toString();
            return (
              <tr key={managerId} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-linear-to-tr from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium shadow-sm">
                        {getInitials(manager.name)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{manager.name || "N/A"}</div>
                      <div className="text-sm text-gray-500">{manager.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-amber-50 text-amber-600 border-amber-200 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full mr-1.5 bg-amber-500 animate-pulse"></span>
                    {manager.status || 'PENDING'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      className={`inline-flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm border border-indigo-100 ${fetchingDetails ? 'opacity-70 cursor-not-allowed' : ''}`}
                      onClick={() => handleManagerDetails(managerId)}
                      disabled={fetchingDetails}
                    >
                      {fetchingDetails ? (
                        <svg className="animate-spin h-4 w-4 mr-1.5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                      {fetchingDetails ? 'Loading...' : 'View'}
                    </button>
                    {/* <button
                      className="inline-flex items-center text-teal-600 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm border border-teal-100"
                      onClick={() => handleApproval(managerId)}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Approve
                    </button>
                    <button
                      className="inline-flex items-center text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm border border-rose-100"
                      onClick={() => handleRejection(managerId)}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      Reject
                    </button> */}
                  </div>
                </td>
              </tr>
            );
          }}
        />
      </div>

      {/* Modal */}
      {isModalOpen && selectedManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/30">
              <h2 className="text-xl font-bold text-gray-900">Manager Application Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Full Name</p>
                    <p className="text-lg font-medium text-gray-900 break-all">{selectedManager.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Experience Level</p>
                    <p className="text-lg font-medium text-gray-900 break-all">{selectedManager.experienceLevel}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Organization Name</p>
                    <p className="text-lg font-medium text-gray-900 break-all">{selectedManager.organizationName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Organization Type</p>
                    <p className="text-lg font-medium text-gray-900 capitalize break-all">{selectedManager.organizationType}</p>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">About Events</p>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 break-all">
                    {selectedManager.aboutEvents}
                  </p>
                </div>

                {selectedManager.socialLinks && selectedManager.socialLinks.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Social Links</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedManager.socialLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link.startsWith('http') ? link : `https://${link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          Link {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents Section */}
                <div className="grid grid-cols-1 gap-6">
                  {/* Certificate */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Certificate</p>
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-emerald-200 transition-all">
                      {selectedManager.certificate && isImageFile(selectedManager.certificate) ? (
                        <div className="space-y-3">
                          <img
                            src={selectedManager.certificate}
                            alt="Certificate"
                            className="w-full h-auto max-h-64 object-contain rounded-lg shadow-sm border border-gray-100 bg-white"
                          />
                          <a href={selectedManager.certificate} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            View Full Resolution
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 truncate mr-2">{selectedManager.certificate || 'Not provided'}</span>
                          {selectedManager.certificate && (
                            <a href={selectedManager.certificate} target="_blank" rel="noopener noreferrer" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Document Reference */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Document Reference</p>
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-emerald-200 transition-all">
                      {selectedManager.documentReference && isImageFile(selectedManager.documentReference) ? (
                        <div className="space-y-3">
                          <img
                            src={selectedManager.documentReference}
                            alt="Document Reference"
                            className="w-full h-auto max-h-64 object-contain rounded-lg shadow-sm border border-gray-100 bg-white"
                          />
                          <a href={selectedManager.documentReference} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            View Full Resolution
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 truncate mr-2">{selectedManager.documentReference || 'Not provided'}</span>
                          {selectedManager.documentReference && (
                            <a href={selectedManager.documentReference} target="_blank" rel="noopener noreferrer" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-white transition-all shadow-sm"
              >
                Close
              </button>
              <div className="flex gap-2">
                <button
                  className="px-6 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-all shadow-md shadow-rose-200"
                  onClick={() => {
                    setRejectionId(selectedManager.userId);
                    setIsRejectionModalOpen(true);
                  }}
                >
                  Reject Application
                </button>
                <button className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200"
                  onClick={() => handleApproval(selectedManager.userId)}>
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Rejection Reason Modal */}
      {isRejectionModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 bg-rose-50/30">
              <h2 className="text-xl font-bold text-gray-900">Provide Rejection Reason</h2>
              <p className="text-sm text-gray-500 mt-1">This reason will be included in the email sent to the applicant.</p>
            </div>

            <div className="p-6">
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none transition-all text-sm text-gray-900"
                placeholder="Enter the reason for rejection (optional)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsRejectionModalOpen(false);
                  setRejectionReason("");
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejection(rejectionId!, rejectionReason)}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-all shadow-md shadow-rose-200"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPendingManagers;
