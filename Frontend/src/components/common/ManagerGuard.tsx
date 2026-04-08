import type { ReactNode } from 'react';
import { useAppSelector } from '../../redux/hook';
import UpgradePrompt from './UpgradePrompt';

interface ManagerGuardProps {
  children: ReactNode;
}

const ManagerGuard = ({ children }: ManagerGuardProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const isManager = user?.role === 'EVENT_MANAGER';

  if (!isManager) {
    return <UpgradePrompt />;
  }

  return <>{children}</>;
};

export default ManagerGuard;
