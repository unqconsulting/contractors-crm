import CreateOrUpdatePartnerOrClient from '@/components/partner-client-form';

export default async function UpdateClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CreateOrUpdatePartnerOrClient id={parseInt(id)} />;
}
