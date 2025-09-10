import CreateOrUpdatePartnerOrClient from '@/components/partner-client-form';

export default async function UpdatePartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CreateOrUpdatePartnerOrClient isPartner={true} id={parseInt(id)} />;
}
