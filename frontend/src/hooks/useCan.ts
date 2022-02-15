import { useAuthContext } from '../context/AuthContext';

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCanParams): boolean {
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) return false;

  if (permissions?.length > 0) {
    const hasAllPermissions = permissions.every(permission =>
      user.permissions.includes(permission)
    );

    if (!hasAllPermissions) return false;
  }

  if (roles?.length > 0) {
    const hasAllRoles = roles.some(permission =>
      user.roles.includes(permission)
    );

    if (!hasAllRoles) return false;
  }

  return true;
}
