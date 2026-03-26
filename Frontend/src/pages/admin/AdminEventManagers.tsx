import { useEffect, useState } from "react";
import { api } from "../../services/api";

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

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/admin/users");
        



        console.log("console.log",response)
        // Extract array from response appropriately
        const usersData: any[] = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.users || response.data?.data || []);
          
        // Filter users who are specifically Event Managers
        const eventManagersData = usersData.filter(
            (user) => user.role === "EVENT_MANAGER" || user.isEventManger === true
        );
        
        setManagers(eventManagersData);
      } catch (err: any) {
        console.error("Failed to fetch event managers:", err);
        setError(err?.response?.data?.message || "Failed to load event managers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);



  const handleManager = async (userId: string, status: string) => {
    const newstatus = status === "ACTIVE" ? "BLOCK" : "ACTIVE";
    
    // Optimistic UI update
    setManagers((prevManagers) =>
      prevManagers.map((manager) =>
        (manager._id || manager.id) === userId ? { ...manager, status: newstatus } : manager
      )
    );

    try {
      await api.patch(`/admin/blockorunblock/${userId}`, {
        status: newstatus
      });
    } catch (error) {
      console.error("Failed to block/unblock manager:", error);
      // Revert UI on failure
      setManagers((prevManagers) =>
        prevManagers.map((manager) =>
          (manager._id || manager.id) === userId ? { ...manager, status: status } : manager
        )
      );
    }
  };
  const getInitials = (name: string) => {
    if (!name) return "E";
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "BLOCKED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out" 
              placeholder="Search event managers..."
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
               <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Manager Details
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {managers.length > 0 ? (
                managers.map((manager, index) => {
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
                          <div className="text-sm font-medium text-gray-900">{manager.name || "N/A"}</div>
                          <div className="text-sm text-gray-500">{manager.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(manager.status)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${manager.status?.toUpperCase() === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                        {manager.status || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {manager.isVerified ? (
                        <div className="flex items-center text-green-600 bg-green-50 px-2.5 py-1 rounded-md w-fit border border-green-100">
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span className="text-xs font-medium">Verified</span>
                        </div>
                      ) : (
                         <div className="flex items-center text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-md w-fit border border-yellow-100">
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-xs font-medium">Pending</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors duration-150 mr-2">
                        View
                      </button>
                      <button className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors duration-150"
                      onClick={() => handleManager(managerId, manager.status)}>
                        {manager.status?.toUpperCase() === 'ACTIVE' ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                )})
              ) : (
                <tr>
                   <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-900">No event managers found</p>
                      <p className="text-sm mt-1 text-gray-500">There are currently no approved event managers on the platform.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEventManagers;
