import { Button } from './ui/button';
import { useEffect, useRef, useState } from 'react';
import CustomLink from './ui/link';
import { CloseIcon, MenuIcon } from './ui/icons';

type CustomTableProps = {
  rows: {
    id?: number;
    detailsId?: number;
    values: (string | number | undefined)[];
  }[];
  columns: string[];
  openModal?: (rowIndex: number) => void;
  type?: string;
  itemsPerPage?: number;
  showRowMenu?: boolean;
  totalRow?: (string | number | undefined)[];
};

export function CustomTable({
  rows,
  columns,
  openModal,
  type,
  itemsPerPage = 6,
  showRowMenu = true,
  totalRow,
}: CustomTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = rows.slice(startIndex, endIndex);
  const [showActions, setShowActions] = useState<{ [key: number]: boolean }>(
    {}
  );
  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionRef.current &&
        !actionRef.current.contains(event.target as Node)
      ) {
        setShowActions({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle page change
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleBack = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Determine if we should show pagination controls
  const shouldPaginate = rows.length > itemsPerPage;

  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i + 1);
  }
  return (
    <>
      <div
        className={`overflow-x-auto  sm:rounded-lg mb-6 pt-[2rem] ${
          !shouldPaginate ? 'pb-[6rem]' : ''
        }`}
      >
        <table>
          <thead className="border-b-4 border-gray-200">
            <tr>
              {columns?.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-center text-sm font-large font-bold uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
              {showActions && showRowMenu && (
                <th
                  scope="col"
                  className="px-6 py-3 text-sm font-large font-bold uppercase tracking-wider text-center"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200  border-b-4 border-gray-200">
            {paginatedRows?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns?.map((_, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    {index === 0 ? (
                      type === 'assignments' ? (
                        <CustomLink
                          href={`/details/${row.detailsId}`}
                          aria-label="Go to details page"
                        >
                          {row.values[index]}
                        </CustomLink>
                      ) : (
                        <div className="font-medium ">{row.values[index]}</div>
                      )
                    ) : (
                      <div>{row.values[index]}</div>
                    )}
                  </td>
                ))}
                {showRowMenu && (
                  <td className="flex py-4 ml-6 mr-2 whitespace-nowrap items-center justify-center">
                    <Button
                      onClick={() =>
                        setShowActions((prev) => ({
                          ...prev,
                          [rowIndex]: !prev[rowIndex],
                        }))
                      }
                      variant={'icon'}
                      aria-label="Open actions menu"
                    >
                      <MenuIcon />
                    </Button>

                    <div className="relative">
                      {showActions[rowIndex] && (
                        <div
                          ref={actionRef}
                          className="absolute z-50 top-[-2.4rem] right-[0rem] flex flex-col p-2 bg-primary-foreground text-primary border border-gray-200 rounded-lg shadow-lg min-w-[10rem]"
                        >
                          <div className="flex items-center justify-between border-b border-primary mb-1">
                            <span className="px-3 font-bold">Actions</span>
                            <Button
                              onClick={() =>
                                setShowActions((prev) => ({
                                  ...prev,
                                  [rowIndex]: false,
                                }))
                              }
                              variant={'icon'}
                              className="hover:bg-primary-foreground hover:text-primary"
                            >
                              <CloseIcon />
                            </Button>
                          </div>
                          <CustomLink
                            href={`/${type}/update/${row?.id}`}
                            variant="inMenu"
                          >
                            Update
                          </CustomLink>
                          <Button
                            onClick={() =>
                              openModal && openModal(startIndex + rowIndex)
                            }
                            variant={'inMenu'}
                          >
                            Delete
                          </Button>
                          {type === 'assignments' && (
                            <CustomLink
                              href={`/assignments/create/${row?.id}`}
                              variant="inMenu"
                            >
                              Create copy
                            </CustomLink>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>

          <tfoot>
            {totalRow && (
              <tr>
                {totalRow?.map((val, index) => (
                  <td key={index} className="px-6 py-8 text-center">
                    <div
                      className={
                        index === 0 ? 'font-bold' : '' + ' font-medium '
                      }
                    >
                      {index === 0 ? 'Totalt' : val}
                    </div>
                  </td>
                ))}
              </tr>
            )}
            {shouldPaginate && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-8 text-center"
                >
                  <div className="flex justify-between space-x-4 w-full">
                    <Button disabled={currentPage === 1} onClick={handleBack}>
                      Back
                    </Button>

                    <div>
                      {pageNumbers.map((number, index) => (
                        <Button
                          key={index}
                          onClick={() => setCurrentPage(number)}
                          variant={'link'}
                          className={
                            number === currentPage ? ' font:bold underline' : ''
                          }
                        >
                          {number}
                        </Button>
                      ))}
                    </div>
                    <Button
                      disabled={currentPage === totalPages}
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
    </>
  );
}
