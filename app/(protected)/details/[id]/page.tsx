'use client';
import { getConsultantAssignmentsByConsultId } from '@/app/core/queries/consult-assignment-queries';
import { ConsultantAssignment } from '@/app/core/types/types';
import { getAssignmentMonth } from '@/app/utilities/helpers/helpers';
import { CustomTable } from '@/components/custom-table';
import CustomLink from '@/components/ui/link';
import { LoadingSpinner } from '@/components/ui/spinner';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [assignments, setAssignments] = useState<ConsultantAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    'Consultant name',
    'Client',
    'Average hourly rate consultant',
    'Average hourly rate client',
    'Hours worked',
    'Month',
    'Total revenue',
    'Total profit',
    'Average margin',
  ];

  useEffect(() => {
    const getConsultAssigments = async () => {
      const { data: assignments, error } =
        await getConsultantAssignmentsByConsultId(parseInt(id));
      if (error) {
        console.error('Error fetching assignments:', error);
      } else {
        setAssignments(assignments);
      }
      setLoading(false);
    };
    getConsultAssigments();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  const {
    totalHours,
    totalProfit,
    addedCostFulltime,
    addedHourlyRate,
    totalRevenue,
    addedMargin,
  } = assignments.reduce(
    (acc, a) => ({
      totalHours: acc.totalHours + Number(a.hours_worked),
      totalProfit: acc.totalProfit + Number(a.profit),
      addedCostFulltime: acc.addedCostFulltime + Number(a.cost_fulltime),
      addedHourlyRate: acc.addedHourlyRate + Number(a.hourly_rate),
      totalRevenue: acc.totalRevenue + Number(a.total_revenue),
      addedMargin: acc.addedMargin + Number(a.margin_percent),
    }),
    {
      totalHours: 0,
      totalProfit: 0,
      addedCostFulltime: 0,
      addedHourlyRate: 0,
      totalRevenue: 0,
      addedMargin: 0,
    }
  );

  const totalRow = [
    assignments[0].consultant?.name,
    '',
    Math.round(addedCostFulltime / assignments.length),
    Math.round(addedHourlyRate / assignments.length),
    totalHours,
    '',
    totalRevenue,
    totalProfit,
    Math.round(addedMargin / assignments.length) + ' %',
  ];

  const rows = assignments.map((assignment) => {
    return {
      id: assignment.assignment_id,
      detailsId: assignment.consultant_id,
      values: [
        assignment.consultant?.name,
        assignment.client?.name,
        assignment.cost_fulltime,
        assignment.hourly_rate,
        assignment.hours_worked,
        getAssignmentMonth(assignment.month ?? ''),
        assignment.total_revenue,
        assignment.profit,
        assignment.margin_percent + ' %',
      ],
    };
  });

  return (
    <>
      <h1 className=" text-3xl mb-4">
        Summary for {assignments[0].consultant?.name}
      </h1>
      <CustomLink href="/assignments" className="mb-4">
        Back to assigments
      </CustomLink>
      <CustomTable
        columns={columns}
        rows={rows}
        showRowMenu={false}
        totalRow={totalRow}
      />
    </>
  );
}
