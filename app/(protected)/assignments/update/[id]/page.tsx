import { UpdateOrCreateConsultantAssignment } from '@/components/consult-assignment-form';

export default async function UpdateConsultantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <UpdateOrCreateConsultantAssignment id={parseInt(id)} />
    </>
  );
}
