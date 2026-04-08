import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hook';
import { setAuth } from '../../redux/slices/authSlice';
import { api } from '../../services/api';

import { useQuery } from '@tanstack/react-query';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      if (response.data && response.data.user) {
        dispatch(setAuth({ user: response.data.user }));
        if (response.data.user.role === 'EVENT_MANAGER') {
          navigate('/eventmanager');
        } else {
          navigate('/');
        }
        return response.data.user;
      }
      throw new Error('User not found');
    },
    enabled: !!token,
    retry: false,
  });

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold">Authenticating...</h2>
        <p className="text-slate-400 mt-2">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
