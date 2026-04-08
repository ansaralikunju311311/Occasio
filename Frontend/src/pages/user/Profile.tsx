import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hook';
import ChangePasswordModal from '../../components/user/ChangePasswordModal';
import HomeButton from '../../components/common/HomeButton';
import { setAuth } from '../../redux/slices/authSlice';
import { useUpdateProfile } from '../../hooks/useUser';

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');

  const profileMutation = useUpdateProfile();

  useEffect(() => {
    if (profileMutation.isSuccess) {
      const response = profileMutation.data;
      if (response.data.profile) {
        dispatch(setAuth({ user: response.data.profile }));
        setIsEditing(false);
      }
    }
  }, [profileMutation.isSuccess, profileMutation.data, dispatch]);

  useEffect(() => {
    if (isEditing) {
      setEditName(user?.name || '');
    }
  }, [isEditing, user?.name]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (!editName.trim()) return;
    profileMutation.mutate(editName);
  };

  const isLoading = profileMutation.isPending;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          My <span className="text-indigo-400">Profile</span>
        </h1>
        <p className="text-slate-400 mt-2">
          Manage your personal information and account security.
        </p>
        <div className="mt-4">
          <HomeButton />
        </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl max-w-2xl text-accent-white">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-800/60 ">
          <div className="w-24 h-24 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name || 'User Name'}</h2>
            <p className="text-slate-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20 uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-white font-medium p-4 bg-slate-950/50 border border-indigo-500/40 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-hidden transition-all"
                placeholder="Enter your name"
                autoFocus
              />
            ) : (
              <div className="text-white font-medium p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                {user?.name}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div className="text-white font-medium p-4 bg-slate-950/50 border border-slate-800 rounded-xl opacity-70">
              {user?.email}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              Edit Profile
            </button>
          )}

          {!isEditing && (
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700"
            >
              Change Password
            </button>
          )}

          {!isEditing && user?.role === 'USER' && (
            <button
              onClick={() => (window.location.href = '/applyasmanager')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold rounded-xl transition-all border border-slate-700 flex items-center gap-2 group"
            >
              <span>Upgrade to Manager</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
