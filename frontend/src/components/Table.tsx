import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { alpha } from '@mui/material/styles';

export interface Column<T> {
  header: string;
  render: (item: T) => ReactNode;
  inputKey?: string;
  renderInput?: (value: any, onChange: (val: any) => void, rowData: Record<string, any>) => ReactNode;
}

interface TableProps<T extends { key: string } = any> {
  data: T[] | undefined;
  pendingData?: T[];
  pendingDeleteKeys?: string[];
  pendingUpdateKeys?: string[];
  columns: Column<T>[];
  loading: boolean;
  error?: any;
  className?: string;
  shadow?: 'none' | 'sm' | 'md';
  striped?: boolean;
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
  showKey?: boolean;
}

type TableRowType = 'insert' | 'pending' | 'data';

interface TableGridRow<T> {
  key: string;
  item: T | Record<string, any>;
  rowType: TableRowType;
}

const actionCellVisible = (
  onInsert?: unknown,
  onSelect?: unknown,
  onDelete?: unknown,
  onUndoDelete?: unknown,
  onEdit?: unknown,
  onUndoUpdate?: unknown,
) => Boolean(onInsert || onSelect || onDelete || onUndoDelete || onEdit || onUndoUpdate);

export function Table<T extends { key: string } = any>({
  data,
  pendingData,
  pendingDeleteKeys = [],
  pendingUpdateKeys = [],
  columns,
  loading,
  error,
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
  showKey = false,
}: TableProps<T>) {
  const [internalInsertData, setInternalInsertData] = useState<Record<string, any>>({});
  const [internalEditData, setInternalEditData] = useState<Record<string, any>>({});
  const visibleColumns = showKey
    ? columns
    : columns.filter((col) => col.header.toLowerCase() !== 'key');
  const showActions = actionCellVisible(onInsert, onSelect, onDelete, onUndoDelete, onEdit, onUndoUpdate);

  const insertData = externalInsertData || internalInsertData;
  const setInsertData = (newData: Record<string, any>) => {
    if (onInsertDataChange) {
      onInsertDataChange(newData);
    } else {
      setInternalInsertData(newData);
    }
  };

  if (error) {
    return <Alert severity="error">Error: {error.message}</Alert>;
  }

  const handleInsert = () => {
    if (onInsert) {
      onInsert(insertData);
      setInsertData({});
    }
  };

  const handleStartEdit = (item: T) => {
    const initialData: Record<string, any> = {};
    visibleColumns.forEach((col) => {
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

  const rows = useMemo(() => {
    const nextRows: TableGridRow<T>[] = [];
    if (onInsert) {
      nextRows.push({ key: '__insert__', item: insertData, rowType: 'insert' });
    }

    pendingData?.forEach((item) => {
      nextRows.push({ key: item.key, item, rowType: 'pending' });
    });

    data?.forEach((item) => {
      nextRows.push({ key: item.key, item, rowType: 'data' });
    });

    return nextRows;
  }, [data, insertData, onInsert, pendingData]);

  const gridColumns: GridColDef<TableGridRow<T>>[] = useMemo(() => {
    const renderInputControl = (
      col: Column<T>,
      value: any,
      onChange: (val: any) => void,
      rowData: Record<string, any>,
    ) => col.renderInput ? (
      col.renderInput(value, onChange, rowData)
    ) : (
      <TextField
        fullWidth
        onChange={(event) => onChange(event.target.value)}
        placeholder={`Enter ${col.header.toLowerCase()}...`}
        size="small"
        value={value || ''}
      />
    );

    const dataColumns = visibleColumns.map<GridColDef<TableGridRow<T>>>((col, index) => ({
      field: `${index}-${col.header}`,
      flex: 1,
      headerName: col.header,
      minWidth: Math.max(130, col.header.length * 12),
      renderCell: (params) => {
        const row = params.row;
        const item = row.item as T;
        const isPendingDelete = row.rowType === 'data' && pendingDeleteKeys.includes(item.key);
        const isEditing = row.rowType === 'data' && editingKey === item.key;

        if (row.rowType === 'insert') {
          return col.inputKey ? (
            <Box sx={{ py: 0.5, width: 1 }}>
              {renderInputControl(
                col,
                insertData[col.inputKey],
                (val) => setInsertData({ ...insertData, [col.inputKey!]: val }),
                insertData,
              )}
            </Box>
          ) : (
            <Typography color="text.disabled" variant="caption">
              N/A
            </Typography>
          );
        }

        if (isEditing && col.inputKey) {
          return (
            <Box sx={{ py: 0.5, width: 1 }}>
              {renderInputControl(
                col,
                internalEditData[col.inputKey],
                (val) => setInternalEditData({ ...internalEditData, [col.inputKey!]: val }),
                internalEditData,
              )}
            </Box>
          );
        }

        return (
          <Box
            sx={{
              overflow: 'hidden',
              textDecoration: isPendingDelete ? 'line-through' : 'none',
              textOverflow: 'ellipsis',
              width: 1,
            }}
          >
            {col.render(item)}
          </Box>
        );
      },
      sortable: false,
    }));

    if (!showActions) return dataColumns;

    return [
      ...dataColumns,
      {
        align: 'right',
        field: '__actions__',
        flex: 0,
        headerAlign: 'right',
        headerName: 'Actions',
        minWidth: 260,
        renderCell: (params) => {
          const row = params.row;

          if (row.rowType === 'insert') {
            return (
              <Button onClick={handleInsert} size="small" variant="contained">
                Confirm
              </Button>
            );
          }

          const item = row.item as T;
          const isSelected = selectedKey === item.key;
          const isPendingDelete = pendingDeleteKeys.includes(item.key);
          const isPendingUpdate = pendingUpdateKeys.includes(item.key);
          const isEditing = editingKey === item.key;

          if (row.rowType === 'pending') {
            return (
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'flex-end', width: 1 }}>
                <Chip color="warning" label="Pending Insert" size="small" variant="outlined" />
                {onUndoInsert && (
                  <IconButton aria-label="Undo insertion" onClick={() => onUndoInsert(item)} size="small">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            );
          }

          return (
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', width: 1 }}>
              {isPendingUpdate && !isEditing && (
                <Chip color="info" label="Pending Update" size="small" variant="outlined" />
              )}

              {onSelect && !isEditing && (
                <Button
                  disabled={Boolean(editingKey)}
                  onClick={() => onSelect(item)}
                  size="small"
                  variant={isSelected ? 'contained' : 'outlined'}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
              )}

              {isEditing ? (
                <>
                  <Button onClick={() => handleSaveEdit(item)} size="small" variant="contained">
                    Save
                  </Button>
                  <Button color="inherit" onClick={onCancelEdit} size="small" variant="outlined">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  {onEdit && !isPendingDelete && !isPendingUpdate && (
                    <Button
                      disabled={Boolean(editingKey)}
                      onClick={() => handleStartEdit(item)}
                      size="small"
                      variant="outlined"
                    >
                      Edit
                    </Button>
                  )}

                  {isPendingUpdate
                    ? onUndoUpdate && (
                        <Button
                          color="inherit"
                          disabled={Boolean(editingKey)}
                          onClick={() => onUndoUpdate(item)}
                          size="small"
                          variant="outlined"
                        >
                          Undo
                        </Button>
                      )
                    : isPendingDelete
                      ? onUndoDelete && (
                          <Button
                            color="inherit"
                            disabled={Boolean(editingKey)}
                            onClick={() => onUndoDelete(item)}
                            size="small"
                            variant="outlined"
                          >
                            Undo
                          </Button>
                        )
                      : onDelete && (
                          <Button
                            color="error"
                            disabled={Boolean(editingKey)}
                            onClick={() => onDelete(item)}
                            size="small"
                            variant="outlined"
                          >
                            Delete
                          </Button>
                        )}
                </>
              )}
            </Stack>
          );
        },
        sortable: false,
      },
    ];
  }, [
    editingKey,
    handleInsert,
    insertData,
    internalEditData,
    onCancelEdit,
    onDelete,
    onEdit,
    onSelect,
    onUndoDelete,
    onUndoInsert,
    onUndoUpdate,
    pendingDeleteKeys,
    pendingUpdateKeys,
    selectedKey,
    setInsertData,
    showActions,
    visibleColumns,
  ]);

  const getRowClassName = (row: TableGridRow<T>) => {
    if (row.rowType === 'insert') return 'table-row-insert';
    if (row.rowType === 'pending') return 'table-row-pending';
    const item = row.item as T;
    if (pendingDeleteKeys.includes(item.key)) return 'table-row-delete';
    if (pendingUpdateKeys.includes(item.key)) return 'table-row-update';
    if (selectedKey === item.key || editingKey === item.key) return 'table-row-selected';
    return '';
  };

  return (
    <Box className={className} sx={{ width: 1 }}>
      {loading && rows.length === 0 ? (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={18} />
          <Typography color="text.secondary">Loading...</Typography>
        </Stack>
      ) : (
        <DataGrid
          autoHeight
          columns={gridColumns}
          disableColumnMenu
          disableRowSelectionOnClick
          getRowClassName={(params) => getRowClassName(params.row)}
          getRowHeight={() => 'auto'}
          getRowId={(row) => row.key}
          loading={loading}
          pageSizeOptions={[10, 25, 50, 100]}
          rows={rows}
          slots={{
            noRowsOverlay: () => (
              <Box sx={{ color: 'text.secondary', fontStyle: 'italic', p: 3, textAlign: 'center' }}>
                No data found.
              </Box>
            ),
          }}
          sx={{
            border: 0,
            bgcolor: 'background.paper',
            '& .MuiDataGrid-cell': {
              alignItems: 'center',
              display: 'flex',
              py: 1,
            },
            '& .MuiDataGrid-cell select, & .MuiDataGrid-cell input, & .MuiDataGrid-cell button:not(.MuiButtonBase-root)': {
              backgroundColor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.08 : 0.025),
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.28 : 0.22)}`,
              borderRadius: '16px',
              color: 'text.primary',
              minHeight: 40,
            },
            '& .MuiDataGrid-cell button:not(.MuiButtonBase-root), & .MuiDataGrid-cell button:not(.MuiButtonBase-root) span': {
              color: (theme) => `${theme.palette.text.primary} !important`,
            },
            '& .MuiDataGrid-cell button:not(.MuiButtonBase-root) svg': {
              color: (theme) => `${theme.palette.text.secondary} !important`,
            },
            '& .MuiDataGrid-cell button:not(.MuiButtonBase-root):disabled, & .MuiDataGrid-cell button:not(.MuiButtonBase-root):disabled span': {
              color: (theme) => `${theme.palette.text.secondary} !important`,
            },
            '& .MuiDataGrid-cell select:focus, & .MuiDataGrid-cell input:focus, & .MuiDataGrid-cell button:not(.MuiButtonBase-root):focus': {
              borderColor: 'primary.main',
              boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.22 : 0.12)}`,
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
              textTransform: 'uppercase',
            },
            '& .MuiDataGrid-row': {
              bgcolor: 'background.paper',
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: 'background.paper',
            },
            '& .table-row-insert': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.12),
            },
            '& .table-row-pending': {
              bgcolor: (theme) => alpha(theme.palette.warning.main, theme.palette.mode === 'dark' ? 0.22 : 0.12),
            },
            '& .table-row-delete': {
              bgcolor: (theme) => alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.24 : 0.12),
              opacity: 0.65,
            },
            '& .table-row-update': {
              bgcolor: (theme) => alpha(theme.palette.info.main, theme.palette.mode === 'dark' ? 0.24 : 0.12),
            },
            '& .table-row-selected': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.1),
            },
          }}
        />
      )}
    </Box>
  );
}
