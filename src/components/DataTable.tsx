import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
} from '@tanstack/react-table';
import { ArrowUpDown, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Institution } from '../types/institution';

interface DataTableProps {
  data: Institution[];
  onRowHover: (institution: Institution | null) => void;
}

const formatNumber = (value: number | null): string => {
  if (value === null || isNaN(value)) return 'N/A';
  return value.toLocaleString();
};

const formatPercent = (value: number | null): string => {
  if (value === null || isNaN(value)) return 'N/A';
  return `${(value * 100).toFixed(1)}%`;
};

const formatCurrency = (value: number | null): string => {
  if (value === null || isNaN(value)) return 'N/A';
  return `$${value.toLocaleString()}`;
};

export default function DataTable({ data, onRowHover }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<Institution>[]>(() => [
    {
      accessorKey: 'inst_name',
      header: 'Institution Name',
    },
    {
      accessorKey: 'admit_rate',
      header: 'Admission Rate',
      cell: info => formatPercent(info.getValue() as number),
    },
    {
      accessorKey: 'number_enrolled_total',
      header: 'Enrollment',
      cell: info => formatNumber(info.getValue() as number),
    },
    {
      accessorKey: 'yield_rate',
      header: 'Yield Rate',
      cell: info => formatPercent(info.getValue() as number),
    },
    {
      accessorKey: 'sum_average_amount',
      header: 'Avg. Amount',
      cell: info => formatCurrency(info.getValue() as number),
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportData = () => {
    const headers = columns.map(col => String(col.header)).join(',');
    const rows = data.map(row =>
      columns.map(col => row[col.accessorKey as keyof Institution]).join(',')
    ).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'institutions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200">
      <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
        <input
          type="text"
          placeholder="SEARCH DATABASE..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="border border-slate-300 p-2 w-64 bg-white text-xs font-mono focus:ring-1 focus:ring-sage-600 focus:border-sage-600 outline-none"
        />
        <button
          onClick={exportData}
          className="flex items-center gap-2 bg-sage-600 text-white px-4 py-2 hover:bg-sage-400 text-xs font-mono uppercase tracking-wider transition-colors"
        >
          <Download className="w-4 h-4" />
          EXPORT_CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-slate-50 border-b border-slate-200">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 text-left font-bold text-[10px] uppercase tracking-widest text-slate-500">
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900" onClick={() => header.column.toggleSorting()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onMouseEnter={() => onRowHover(row.original)}
                onMouseLeave={() => onRowHover(null)}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 text-sm font-mono text-slate-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-white">
        <div className="text-xs font-mono text-slate-500">
          SHOWING {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} TO{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          OF {table.getFilteredRowModel().rows.length} RESULTS
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 disabled:opacity-50 hover:bg-slate-100 border border-transparent hover:border-slate-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-600">
            PAGE {table.getState().pagination.pageIndex + 1} OF{' '}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 disabled:opacity-50 hover:bg-slate-100 border border-transparent hover:border-slate-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}