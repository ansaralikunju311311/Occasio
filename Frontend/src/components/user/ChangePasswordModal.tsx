import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { ResetPassword } from '../../types/auth.type';
import { useAppSelector } from '../../redux/hook';
import PasswordInput from '../common/PasswordInput';
import { useUpdatePassword } from '../../hooks/useAuth';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const user = useAppSelector((state) => state.auth.user);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ResetPassword>({
    mode: 'onBlur',
  });

  const updatePasswordMutation = useUpdatePassword();

  React.useEffect(() => {
    if (updatePasswordMutation.isSuccess) {
      toast.success('Password updated successfully');
      reset();
      onClose();
    }
    if (updatePasswordMutation.isError) {
      const error = updatePasswordMutation.error as any;
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    }
  }, [updatePasswordMutation.isSuccess, updatePasswordMutation.isError, updatePasswordMutation.error, reset, onClose]);

  const onSubmit = (data: ResetPassword) => {
    updatePasswordMutation.mutate({
      email: user?.email,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">
            Change <span className="text-indigo-400">Password</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">
              Current Password
            </label>
            <PasswordInput
              {...register('currentPassword', { required: 'Current password is required' })}
              className={`w-full bg-slate-950/50 border ${errors.currentPassword ? 'border-red-500' : 'border-slate-800'} rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
              placeholder="••••••••"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">
              New Password
            </label>
            <PasswordInput
              {...register('newPassword', {
                required: 'New password is required',
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'Min 8 chars, include uppercase, lowercase, number & special character',
                },
              })}
              className={`w-full bg-slate-950/50 border ${errors.newPassword ? 'border-red-500' : 'border-slate-800'} rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
              placeholder="••••••••"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">
              Confirm New Password
            </label>
            <PasswordInput
              {...register('confirmPassword', {
                required: 'Please confirm your new password',
                validate: (value) => value === getValues('newPassword') || 'Passwords do not match',
              })}
              className={`w-full bg-slate-950/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-800'} rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-750 text-white font-bold rounded-xl transition-all border border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
