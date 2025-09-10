import { ConsultantForm } from '@/components/consultant-form';

export default async function UpdateConsultantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ConsultantForm id={parseInt(id)} />;
}
