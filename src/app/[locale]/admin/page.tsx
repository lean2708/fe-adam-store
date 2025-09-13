import AdminDashboard from '@/components/templates/admin/AdminDashboard';
import { pageMetadataPresets } from '@/lib/metadata';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return pageMetadataPresets.adminDashboard(locale);
}

export default async function AdminPage() {
  return <AdminDashboard />;
}
