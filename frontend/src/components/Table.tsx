import type { ReactNode } from 'react';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

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
  shadow = 'sm',
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
  const visibleColumns = columns.filter((col) => col.header.toLowerCase() !== 'key');
  const showActions = actionCellVisible(onInsert, onSelect, onDelete, onUndoDelete, onEdit, onUndoUpdate);

  const insertData = externalInsertData || internalInsertData;
  const setInsertData = (newData: Record<string, any>) => {
    if (onInsertDataChange) {
      onInsertDataChange(newData);
    } else {
      setInternalInsertData(newData);
    }
  };

  if (loading) {
    return (
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={18} />
        <Typography color="text.secondary">Loading...</Typography>
      </Stack>
    );
  }

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

  const hasData = (data && data.length > 0) || (pendingData && pendingData.length > 0);
  const elevation = shadow === 'none' ? 0 : shadow === 'md' ? 3 : 1;

  return (
    <TableContainer className={className} component={Paper} elevation={elevation}>
      <MuiTable size="small">
        <TableHead>
          <TableRow>
            {visibleColumns.map((col) => (
              <TableCell key={col.header} sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                {col.header}
              </TableCell>
            ))}
            {showActions && (
              <TableCell align="right" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {onInsert && (
            <TableRow sx={{ bgcolor: 'primary.50' }}>
              {visibleColumns.map((col) => (
                <TableCell key={col.header}>
                  {col.inputKey ? (
                    col.renderInput ? (
                      col.renderInput(
                        insertData[col.inputKey],
                        (val) => setInsertData({ ...insertData, [col.inputKey!]: val }),
                        insertData,
                      )
                    ) : (
                      <TextField
                        fullWidth
                        onChange={(event) =>
                          setInsertData({ ...insertData, [col.inputKey!]: event.target.value })
                        }
                        placeholder={`Enter ${col.header.toLowerCase()}...`}
                        size="small"
                        value={insertData[col.inputKey] || ''}
                      />
                    )
                  ) : (
                    <Typography color="text.disabled" variant="caption">
                      N/A
                    </Typography>
                  )}
                </TableCell>
              ))}
              <TableCell align="right">
                <Button onClick={handleInsert} size="small" variant="contained">
                  Confirm
                </Button>
              </TableCell>
            </TableRow>
          )}

          {pendingData?.map((item) => (
            <TableRow key={item.key} sx={{ bgcolor: 'warning.50' }}>
              {visibleColumns.map((col) => (
                <TableCell key={col.header}>{col.render(item)}</TableCell>
              ))}
              <TableCell align="right">
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Chip color="warning" label="Pending Insert" size="small" variant="outlined" />
                  {onUndoInsert && (
                    <IconButton aria-label="Undo insertion" onClick={() => onUndoInsert(item)} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}

          {data?.map((item) => {
            const isSelected = selectedKey === item.key;
            const isPendingDelete = pendingDeleteKeys.includes(item.key);
            const isPendingUpdate = pendingUpdateKeys.includes(item.key);
            const isEditing = editingKey === item.key;

            return (
              <TableRow
                hover
                key={item.key}
                selected={isSelected || isEditing}
                sx={{
                  '&:nth-of-type(even)': striped ? { bgcolor: 'action.hover' } : undefined,
                  bgcolor: isPendingDelete
                    ? 'error.50'
                    : isPendingUpdate
                      ? 'info.50'
                      : undefined,
                  opacity: isPendingDelete ? 0.65 : 1,
                }}
              >
                {visibleColumns.map((col) => (
                  <TableCell
                    key={col.header}
                    sx={{ textDecoration: isPendingDelete ? 'line-through' : 'none' }}
                  >
                    {isEditing && col.inputKey ? (
                      col.renderInput ? (
                        col.renderInput(
                          internalEditData[col.inputKey],
                          (val) => setInternalEditData({ ...internalEditData, [col.inputKey!]: val }),
                          internalEditData,
                        )
                      ) : (
                        <TextField
                          fullWidth
                          onChange={(event) =>
                            setInternalEditData({
                              ...internalEditData,
                              [col.inputKey!]: event.target.value,
                            })
                          }
                          size="small"
                          value={internalEditData[col.inputKey] || ''}
                        />
                      )
                    ) : (
                      col.render(item)
                    )}
                  </TableCell>
                ))}

                {showActions && (
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
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
                  </TableCell>
                )}
              </TableRow>
            );
          })}

          {!hasData && !onInsert && (
            <TableRow>
              <TableCell align="center" colSpan={visibleColumns.length + (showActions ? 1 : 0)}>
                <Box sx={{ color: 'text.secondary', fontStyle: 'italic', p: 3 }}>
                  No data found.
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
