import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const tableContainerVariants = cva(
  "w-full overflow-x-auto rounded-lg shadow-sm border border-gray-100",
  {
    variants: {
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
      },
    },
    defaultVariants: {
      shadow: "sm",
    },
  }
);

const tableVariants = cva("w-full border-collapse text-left text-sm", {
  variants: {
    striped: {
      true: "[&_tbody_tr:nth-child(even)]:bg-gray-50/50",
    },
  },
  defaultVariants: {
    striped: false,
  },
});

export interface Column<T> {
  header: string;
  render: (item: T) => ReactNode;
}

interface TableProps<T extends { key: string }> extends VariantProps<typeof tableContainerVariants>, VariantProps<typeof tableVariants> {
  data: T[] | undefined;
  columns: Column<T>[];
  loading: boolean;
  error?: any;
  className?: string;
}

export function Table<T extends { key: string }>({
  data,
  columns,
  loading,
  error,
  shadow,
  striped,
  className,
}: TableProps<T>) {
  if (loading) return <p className="p-8 text-center italic text-gray-500">Loading...</p>;
  if (error) return <p className="p-8 text-center font-medium text-red-500">Error: {error.message}</p>;
  if (!data || data.length === 0) return <p className="p-8 text-center italic text-gray-500">No data found.</p>;

  return (
    <div className={cn(tableContainerVariants({ shadow }), className)}>
      <table className={tableVariants({ striped })}>
        <thead className="bg-gray-50/80 border-b border-gray-200">
          <tr>
            {columns.map((col, i) => (
              <th 
                key={i} 
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((item) => (
            <tr key={item.key} className="transition-colors hover:bg-gray-50/50">
              {columns.map((col, i) => (
                <td key={i} className="px-4 py-3 text-gray-700">
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
