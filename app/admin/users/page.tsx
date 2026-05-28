export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getAdminUsers } from '@/lib/data/admin';
import { getAuthUser } from '@/lib/auth';
import UsersManager from '@/components/features/admin/UsersManager';

export const metadata: Metadata = {
  title: 'Users – Admin',
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  const [users, authUser] = await Promise.all([getAdminUsers(), getAuthUser()]);
  return <UsersManager users={users} currentAdminId={authUser?.id ?? ''} />;
}
