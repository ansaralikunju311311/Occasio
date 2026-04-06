import type { ReactNode } from "react";

export interface Column {
  header: ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column[];
  data: T[];
  renderRow: (item: T, index: number) => ReactNode;
  emptyState?: ReactNode;
  loading?: boolean;
  
  // Customization
  tableClassName?: string;
  theadClassName?: string;
  trHeadClassName?: string;
  tbodyClassName?: string;
}

export function Table<T>({
  columns,
  data,
  renderRow,
  emptyState,
  loading,
  tableClassName = "min-w-full divide-y divide-gray-200",
  theadClassName = "bg-gray-50",
  trHeadClassName = "",
  tbodyClassName = "bg-white divide-y divide-gray-200"
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className={tableClassName}>
        <thead className={theadClassName}>
          <tr className={trHeadClassName}>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                scope="col" 
                className={col.className || "px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={tbodyClassName}>
          {loading ? (
             <tr>
               <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                 <div className="flex flex-col items-center justify-center space-y-3">
                   <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                   <p className="text-sm font-medium animate-pulse">Loading data...</p>
                 </div>
               </td>
             </tr>
          ) : data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
              emptyState
          )}
        </tbody>
      </table>
    </div>
  );
}
