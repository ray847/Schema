import { ReactNode, useState } from 'react';
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
  inputKey?: string;
  renderInput?: (value: any, onChange: (val: any) => void, rowData: Record<string, any>) => ReactNode;
}

interface TableProps<T extends { key: string }> extends VariantProps<typeof tableContainerVariants>, VariantProps<typeof tableVariants> {
  data: T[] | undefined;
  pendingData?: T[];
  pendingDeleteKeys?: string[];
  pendingUpdateKeys?: string[];
  columns: Column<T>[];
  loading: boolean;
  error?: any;
  className?: string;
  onInsert?: (item: Record<string, any>) => void;
  onDelete?: (item: T) => void;
  onUndoInsert?: (item: T) => void;
  onUndoDelete?: (item: T) => void;
  onUndoUpdate?: (item: T) => void;
  onEdit?: (item: T) => void;
  onSaveEdit?: (item: T, data: Record<string, any>) => void;
  onCancelEdit?: () => void;
  editingKey?: string;
  insertData?: Record<string, any>;
  onInsertDataChange?: (data: Record<string, any>) => void;
  onSelect?: (item: T) => void;
  selectedKey?: string;
}

export function Table<T extends { key: string }>({
  data,
  pendingData,
  pendingDeleteKeys = [],
  pendingUpdateKeys = [],
  columns,
  loading,
  error,
  shadow,
  striped,
  className,
  onInsert,
  onDelete,
  onUndoInsert,
  onUndoDelete,
  onUndoUpdate,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  editingKey,
  insertData: externalInsertData,
  onInsertDataChange,
  onSelect,
  selectedKey,
}: TableProps<T>) {
  const [internalInsertData, setInternalInsertData] = useState<Record<string, any>>({});
  const [internalEditData, setInternalEditData] = useState<Record<string, any>>({});
  
  const insertData = externalInsertData || internalInsertData;
  const setInsertData = (newData: Record<string, any>) => {
    if (onInsertDataChange) {
      onInsertDataChange(newData);
    } else {
      setInternalInsertData(newData);
    }
  };

  if (loading) return <p className="p-8 text-center italic text-gray-500">Loading...</p>;
  if (error) return <p className="p-8 text-center font-medium text-red-500">Error: {error.message}</p>;

  const handleInsert = () => {
    if (onInsert) {
      onInsert(insertData);
      setInsertData({});
    }
  };

  const handleStartEdit = (item: T) => {
    const initialData: Record<string, any> = {};
    columns.forEach(col => {
      if (col.inputKey) {
        initialData[col.inputKey] = (item as any)[col.inputKey];
      }
    });
    setInternalEditData(initialData);
    if (onEdit) onEdit(item);
  };

  const handleSaveEdit = (item: T) => {
    if (onSaveEdit) {
      onSaveEdit(item, internalEditData);
    }
  };

  const hasData = (data && data.length > 0) || (pendingData && pendingData.length > 0);

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
            {(onInsert || onSelect || onDelete || onUndoDelete || onEdit || onUndoUpdate) && (
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 text-right">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {onInsert && (
            <tr className="bg-blue-50/30">
              {columns.map((col, i) => (
                <td key={i} className="px-4 py-2">
                  {col.inputKey ? (
                    col.renderInput ? (
                      col.renderInput(
                        insertData[col.inputKey],
                        (val) => setInsertData({ ...insertData, [col.inputKey!]: val }),
                        insertData
                      )
                    ) : (
                      <input
                        type="text"
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        placeholder={`Enter ${col.header.toLowerCase()}...`}
                        value={insertData[col.inputKey] || ''}
                        onChange={(e) => setInsertData({ ...insertData, [col.inputKey!]: e.target.value })}
                      />
                    )
                  ) : (
                    <span className="text-gray-400 italic text-xs">N/A</span>
                  )}
                </td>
              ))}
              <td className="px-4 py-2 text-right">
                <button
                  onClick={handleInsert}
                  className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                >
                  Confirm
                </button>
              </td>
            </tr>
          )}
          {pendingData?.map((item) => (
            <tr key={item.key} className="bg-amber-50/50 italic border-l-4 border-l-amber-400">
              {columns.map((col, i) => (
                <td key={i} className="px-4 py-3 text-gray-600">
                  {col.render(item)}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end items-center gap-3">
                  <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded shadow-sm border border-amber-200">Pending Insert</span>
                  {onUndoInsert && (
                    <button
                      onClick={() => onUndoInsert(item)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      title="Undo Insertion"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {data?.map((item) => {
            const isSelected = selectedKey === item.key;
            const isPendingDelete = pendingDeleteKeys.includes(item.key);
            const isPendingUpdate = pendingUpdateKeys.includes(item.key);
            const isEditing = editingKey === item.key;
            
            return (
              <tr 
                key={item.key} 
                className={cn(
                  "transition-colors hover:bg-gray-50/50",
                  isSelected && "bg-blue-50 hover:bg-blue-100/50",
                  isPendingDelete && "bg-red-50/50 opacity-60 grayscale-[0.5]",
                  isPendingUpdate && "bg-indigo-50/50 border-l-4 border-l-indigo-400",
                  isEditing && "bg-indigo-50/30 ring-2 ring-inset ring-indigo-500/20"
                )}
              >
                {columns.map((col, i) => (
                  <td key={i} className={cn("px-4 py-3 text-gray-700", isPendingDelete && "line-through")}>
                    {isEditing && col.inputKey ? (
                      col.renderInput ? (
                        col.renderInput(
                          internalEditData[col.inputKey],
                          (val) => setInternalEditData({ ...internalEditData, [col.inputKey!]: val }),
                          internalEditData
                        )
                      ) : (
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                          value={internalEditData[col.inputKey] || ''}
                          onChange={(e) => setInternalEditData({ ...internalEditData, [col.inputKey!]: e.target.value })}
                        />
                      )
                    ) : (
                      col.render(item)
                    )}
                  </td>
                ))}
                {(onInsert || onSelect || onDelete || onUndoDelete || onEdit || onUndoUpdate) && (
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex justify-end items-center gap-2">
                      {isPendingUpdate && !isEditing && (
                        <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded shadow-sm border border-indigo-200">Pending Update</span>
                      )}
                      
                      {onSelect && !isEditing && (
                        <button
                          disabled={!!editingKey}
                          onClick={() => onSelect(item)}
                          className={cn(
                            "px-3 py-1 text-xs font-medium rounded transition-colors",
                            isSelected 
                              ? "bg-blue-600 text-white shadow-sm" 
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                            !!editingKey && "opacity-50 cursor-not-allowed grayscale"
                          )}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      )}
                      
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(item)}
                            className="px-3 py-1 text-xs font-medium rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={onCancelEdit}
                            className="px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors border border-gray-200"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {onEdit && !isPendingDelete && !isPendingUpdate && (
                            <button
                              disabled={!!editingKey}
                              onClick={() => handleStartEdit(item)}
                              className={cn(
                                "px-3 py-1 text-xs font-medium rounded bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-colors shadow-sm",
                                !!editingKey && "opacity-50 cursor-not-allowed grayscale"
                              )}
                            >
                              Edit
                            </button>
                          )}
                          
                          {isPendingUpdate ? (
                            onUndoUpdate && (
                              <button
                                disabled={!!editingKey}
                                onClick={() => onUndoUpdate(item)}
                                className={cn(
                                  "px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors border border-gray-200",
                                  !!editingKey && "opacity-50 cursor-not-allowed"
                                )}
                              >
                                Undo
                              </button>
                            )
                          ) : isPendingDelete ? (
                            onUndoDelete && (
                              <button
                                disabled={!!editingKey}
                                onClick={() => onUndoDelete(item)}
                                className={cn(
                                  "px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors border border-gray-200",
                                  !!editingKey && "opacity-50 cursor-not-allowed"
                                )}
                              >
                                Undo
                              </button>
                            )
                          ) : (
                            onDelete && (
                              <button
                                disabled={!!editingKey}
                                onClick={() => onDelete(item)}
                                className={cn(
                                  "px-3 py-1 text-xs font-medium rounded bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm",
                                  !!editingKey && "opacity-50 cursor-not-allowed grayscale"
                                )}
                              >
                                Delete
                              </button>
                            )
                          )}
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
          {!hasData && !onInsert && (
            <tr>
              <td colSpan={columns.length + (onSelect || onDelete || onUndoDelete || onEdit || onUndoUpdate ? 1 : 0)} className="p-8 text-center italic text-gray-500">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
