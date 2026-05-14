import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { CurrentUser } from '../api/authentication';
import { Popout } from '../components/Popout';
import { Table } from '../components/Table';
import { Tile } from '../components/Tile';
import { useAuth } from '../features/authentication';
import {
  type ModelType,
  type PreferenceTargetType,
  useConsoleData,
} from '../features/console';
import {
  createTaskTemplate,
  defaultTaskTemplateDraft,
  TASK_TEMPLATE_ROOM_TYPES,
  type TaskTemplate,
  type TaskTemplateRoomTypeMode,
  useTaskTemplates,
} from '../features/taskTemplates';
import type { RoomType } from '../shared';

interface UserPageProps {
  currentUser: CurrentUser | null;
}

interface PreferenceViewProps {
  currentUser: CurrentUser;
}

function PreferenceView({ currentUser }: PreferenceViewProps) {
  const [currentInsertData, setCurrentInsertData] = useState<Record<string, any>>({});
  const [editingKey, setEditingKey] = useState<string | undefined>(undefined);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);
  const [pendingDeletions, setPendingDeletions] = useState<any[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, any>>({});
  const [selectionConfig, setSelectionConfig] = useState<{
    isOpen: boolean;
    model: ModelType;
    title: string;
    onSelect: (item: any) => void;
  }>({ isOpen: false, model: 'CAMPUS', title: '', onSelect: () => {} });

  const preferenceUserKey = String(currentUser.key);
  const { queries, mutations } = useConsoleData({
    currentUserKey: preferenceUserKey,
    selectedModel: 'PREFERENCE',
    selectionModel: selectionConfig.model,
  });
  const {
    campusQuery,
    buildingQuery,
    roomQuery,
    preferenceQuery,
  } = queries;
  const {
    createPreference,
    deletePreference,
    updatePreference,
  } = mutations;

  const findByKey = (items: any[] | undefined, key: any) =>
    items?.find((item) => String(item.key) === String(key));

  const getPreferenceTargetType = (preference: Record<string, any>): PreferenceTargetType | undefined => {
    if (preference.target?.targetType) return preference.target.targetType;
    if (preference.targetType) return preference.targetType;
    if (preference.roomKey) return 'ROOM';
    if (preference.buildingKey) return 'BUILDING';
    if (preference.campusKey) return 'CAMPUS';
    return undefined;
  };

  const getPreferenceTargetKey = (preference: Record<string, any>, targetType?: PreferenceTargetType) => {
    if (preference.target?.targetType === targetType) return preference.target.key;
    if (preference.targetKey) return preference.targetKey;
    if (targetType === 'ROOM') return preference.roomKey;
    if (targetType === 'BUILDING') return preference.buildingKey;
    if (targetType === 'CAMPUS') return preference.campusKey;
    return undefined;
  };

  const getPreferenceTarget = (targetType: PreferenceTargetType | undefined, targetKey: any) => {
    if (targetType === 'ROOM') return findByKey(roomQuery.data?.listRoom, targetKey);
    if (targetType === 'BUILDING') return findByKey(buildingQuery.data?.listBuilding, targetKey);
    if (targetType === 'CAMPUS') return findByKey(campusQuery.data?.listCampus, targetKey);
    return undefined;
  };

  const preferenceRows = useMemo(() =>
    preferenceQuery.data?.listPreference.map((preference) => {
      const targetType = getPreferenceTargetType(preference);
      const targetKey = getPreferenceTargetKey(preference, targetType);
      const target = getPreferenceTarget(targetType, targetKey);
      return {
        ...preference,
        targetType,
        targetKey,
        target: target ? { ...target, targetType } : undefined,
      };
    }),
    [buildingQuery.data?.listBuilding, campusQuery.data?.listCampus, preferenceQuery.data?.listPreference, roomQuery.data?.listRoom],
  );

  const renderPreferenceTargetType = (targetType?: PreferenceTargetType) => {
    if (targetType === 'ROOM') return 'Room';
    if (targetType === 'BUILDING') return 'Building';
    if (targetType === 'CAMPUS') return 'Campus';
    return '';
  };

  const renderModelReference = (model: any, fallbackKey?: any) => {
    const key = model?.key ?? fallbackKey ?? (typeof model === 'object' ? undefined : model);
    const label = model?.name ?? model?.courseCode ?? (key ? `#${key}` : '-');
    return <span>{label}</span>;
  };

  const renderPreferenceTarget = (preference: Record<string, any>) => {
    const targetType = getPreferenceTargetType(preference);
    const targetKey = getPreferenceTargetKey(preference, targetType);
    const target = preference.target || getPreferenceTarget(targetType, targetKey);
    if (target?.name) return renderModelReference(target, targetKey);
    if (targetKey) return renderModelReference(undefined, targetKey);
    return <Typography color="text.secondary" variant="body2">No target</Typography>;
  };

  const buildPreferenceInput = (item: Record<string, any>) => {
    const targetType = getPreferenceTargetType(item);
    const targetKey = getPreferenceTargetKey(item, targetType);
    const parsedValue = Number.parseFloat(String(item.value ?? 0));
    const input: Record<string, any> = {
      value: Number.isFinite(parsedValue)
        ? Math.max(-1, Math.min(1, parsedValue))
        : 0,
    };

    if (targetType === 'ROOM') input.roomKey = String(targetKey ?? '');
    if (targetType === 'BUILDING') input.buildingKey = String(targetKey ?? '');
    if (targetType === 'CAMPUS') input.campusKey = String(targetKey ?? '');
    return input;
  };

  const renderSelectionTable = () => {
    const closeWithSelection = (item: any) => {
      selectionConfig.onSelect(item);
      setSelectionConfig({ ...selectionConfig, isOpen: false });
    };

    switch (selectionConfig.model) {
      case 'CAMPUS':
        return (
          <Table
            data={campusQuery.data?.listCampus}
            loading={campusQuery.loading}
            error={campusQuery.error}
            onSelect={closeWithSelection}
            columns={[
              { header: 'Name', render: (campus) => <span>{campus.name}</span> },
              { header: 'Address', render: (campus) => campus.address },
            ]}
          />
        );
      case 'BUILDING':
        return (
          <Table
            data={buildingQuery.data?.listBuilding}
            loading={buildingQuery.loading}
            error={buildingQuery.error}
            onSelect={closeWithSelection}
            columns={[
              { header: 'Name', render: (building) => <span>{building.name}</span> },
              { header: 'Campus', render: (building) => renderModelReference(building.campus, building.campusKey) },
            ]}
          />
        );
      case 'ROOM':
        return (
          <Table
            data={roomQuery.data?.listRoom}
            loading={roomQuery.loading}
            error={roomQuery.error}
            onSelect={closeWithSelection}
            columns={[
              { header: 'Name', render: (room) => <span>{room.name}</span> },
              { header: 'Building', render: (room) => renderModelReference(room.building, room.buildingKey) },
            ]}
          />
        );
      default:
        return null;
    }
  };

  const handleConfirmInsert = (item: Record<string, any>) => {
    setPendingChanges((prev) => [
      ...prev,
      { ...item, key: `pending-PREFERENCE-${prev.length}` },
    ]);
    setCurrentInsertData({});
  };

  const handleApply = async () => {
    if (pendingChanges.length === 0 && pendingDeletions.length === 0 && Object.keys(pendingUpdates).length === 0) return;

    for (const item of pendingDeletions) {
      await deletePreference({ variables: { userKey: preferenceUserKey, preferenceKey: item.key } });
    }
    for (const [preferenceKey, replacements] of Object.entries(pendingUpdates)) {
      await updatePreference({
        variables: {
          userKey: preferenceUserKey,
          preferenceKey,
          input: buildPreferenceInput(replacements),
        },
      });
    }
    if (pendingChanges.length > 0) {
      await createPreference({
        variables: {
          userKey: preferenceUserKey,
          inputs: pendingChanges.map(buildPreferenceInput),
        },
      });
    }

    await preferenceQuery.refetch({ userKey: preferenceUserKey });
    setPendingChanges([]);
    setPendingDeletions([]);
    setPendingUpdates({});
  };

  const hasTotalPending =
    pendingChanges.length > 0 ||
    pendingDeletions.length > 0 ||
    Object.keys(pendingUpdates).length > 0;

  return (
    <>
      <Tile component="section">
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between' }}>
            <Typography variant="h6">Preferences</Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }} useFlexGap>
              {pendingChanges.length > 0 && <Typography color="warning.main" variant="caption">{pendingChanges.length} pending insert</Typography>}
              {pendingDeletions.length > 0 && <Typography color="error.main" variant="caption">{pendingDeletions.length} pending delete</Typography>}
              {Object.keys(pendingUpdates).length > 0 && <Typography color="info.main" variant="caption">{Object.keys(pendingUpdates).length} pending update</Typography>}
              <Button disabled={!hasTotalPending} onClick={handleApply} size="small" variant="contained">
                Apply changes
              </Button>
            </Stack>
          </Stack>
          <Table
            insertData={currentInsertData}
            onInsertDataChange={setCurrentInsertData}
            onInsert={handleConfirmInsert}
            onDelete={(item) => setPendingDeletions((prev) => [...prev, item])}
            onUndoInsert={(item) => setPendingChanges((prev) => prev.filter((pending) => pending.key !== item.key))}
            onUndoDelete={(item) => setPendingDeletions((prev) => prev.filter((pending) => pending.key !== item.key))}
            onUndoUpdate={(item) => setPendingUpdates((prev) => {
              const next = { ...prev };
              delete next[item.key];
              return next;
            })}
            onEdit={(item) => setEditingKey(item.key)}
            onSaveEdit={(item, data) => {
              setPendingUpdates((prev) => ({ ...prev, [item.key]: data }));
              setEditingKey(undefined);
            }}
            onCancelEdit={() => setEditingKey(undefined)}
            editingKey={editingKey}
            pendingData={pendingChanges}
            pendingDeleteKeys={pendingDeletions.map((item) => item.key)}
            pendingUpdateKeys={Object.keys(pendingUpdates)}
            data={preferenceRows}
            loading={preferenceQuery.loading}
            error={preferenceQuery.error}
            columns={[
              {
                header: 'Target Type',
                inputKey: 'target',
                renderInput: (val, onChange) => (
                  <FormControl fullWidth size="small">
                    <Select
                      displayEmpty
                      value={val?.targetType || ''}
                      onChange={(event) => onChange({ targetType: event.target.value })}
                    >
                      <MenuItem value="">Select Target</MenuItem>
                      <MenuItem value="CAMPUS">Campus</MenuItem>
                      <MenuItem value="BUILDING">Building</MenuItem>
                      <MenuItem value="ROOM">Room</MenuItem>
                    </Select>
                  </FormControl>
                ),
                render: (preference) => <span>{renderPreferenceTargetType(getPreferenceTargetType(preference))}</span>,
              },
              {
                header: 'Target',
                inputKey: 'target',
                renderInput: (val, onChange) => {
                  const targetType = val?.targetType as PreferenceTargetType | undefined;
                  const selectedTarget = val?.key && val?.targetType === targetType
                    ? (getPreferenceTarget(targetType, val.key) || val)
                    : undefined;
                  return (
                    <Button
                      disabled={!targetType}
                      onClick={() => targetType && setSelectionConfig({
                        isOpen: true,
                        model: targetType,
                        title: `Select ${renderPreferenceTargetType(targetType)}`,
                        onSelect: (item) => onChange({ ...item, targetType }),
                      })}
                      sx={{ justifyContent: 'space-between', minHeight: 40, textAlign: 'left', width: 1 }}
                      variant="outlined"
                    >
                      {selectedTarget?.name || (targetType ? `Pick ${renderPreferenceTargetType(targetType)}...` : 'Pick type first')}
                    </Button>
                  );
                },
                render: renderPreferenceTarget,
              },
              {
                header: 'Value',
                inputKey: 'value',
                renderInput: (val, onChange) => (
                  <TextField
                    fullWidth
                    size="small"
                    slotProps={{ htmlInput: { max: 1, min: -1, step: 0.1 } }}
                    type="number"
                    value={val ?? ''}
                    onChange={(event) => onChange(event.target.value)}
                  />
                ),
                render: (preference) => <span className="tabular-nums">{Number(preference.value).toFixed(2)}</span>,
              },
            ]}
          />
        </Stack>
      </Tile>
      <Popout
        isOpen={selectionConfig.isOpen}
        onClose={() => setSelectionConfig({ ...selectionConfig, isOpen: false })}
        title={selectionConfig.title}
      >
        <Stack spacing={2}>
          <Typography color="text.secondary" variant="body2">
            Select an entry to populate the preference target.
          </Typography>
          {renderSelectionTable()}
        </Stack>
      </Popout>
    </>
  );
}

export function UserPage({ currentUser }: UserPageProps) {
  const { signOut } = useAuth();
  const {
    deleteTemplate,
    error: templateError,
    loading: templatesLoading,
    templates,
    upsertTemplate,
  } = useTaskTemplates(currentUser?.key);

  const updateTemplate = (template: TaskTemplate, patch: Partial<TaskTemplate>) => {
    void upsertTemplate({
      ...template,
      ...patch,
      task: {
        ...template.task,
        ...(patch.task ?? {}),
        roomTypes: [...(patch.task?.roomTypes ?? template.task.roomTypes)],
      },
    });
  };

  const addTemplate = () => {
    void upsertTemplate(
      createTaskTemplate(
        `Template ${templates.length + 1}`,
        defaultTaskTemplateDraft(templates.length + 1),
      ),
    );
  };

  return (
    <Stack spacing={3}>
      {currentUser && (
        <Tile component="section" tone="high">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between' }}
          >
            <Box>
              <Typography variant="h6">User</Typography>
              <Typography color="text.secondary" variant="body2">
                Signed in as {currentUser.email}.
              </Typography>
            </Box>
            <Button onClick={signOut} variant="outlined">
              Sign out
            </Button>
          </Stack>
        </Tile>
      )}
      {currentUser && (
        <Tile component="section" tone="high">
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6">Task templates</Typography>
              <Typography color="text.secondary" variant="body2">
                Save reusable task defaults for the planning page.
              </Typography>
            </Box>
              {templateError && <Alert severity="error">{templateError}</Alert>}
              {templatesLoading && <Alert severity="info">Loading task templates...</Alert>}
              {templates.map((template) => (
                <Tile key={template.id} sx={{ p: 2 }} tone="container">
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }} useFlexGap>
                      <TextField
                        label="Template"
                        onChange={(event) => updateTemplate(template, { title: event.target.value })}
                        size="small"
                        sx={{ flex: '1 1 180px' }}
                        value={template.title}
                      />
                      <TextField
                        label="Task"
                        onChange={(event) => updateTemplate(template, { task: { ...template.task, name: event.target.value } })}
                        size="small"
                        sx={{ flex: '1 1 180px' }}
                        value={template.task.name}
                      />
                      <TextField
                        label="Earliest start"
                        onChange={(event) => updateTemplate(template, { task: { ...template.task, start: event.target.value } })}
                        size="small"
                        sx={{ flex: '1 1 140px' }}
                        type="time"
                        value={template.task.start}
                      />
                      <TextField
                        label="Latest end"
                        onChange={(event) => updateTemplate(template, { task: { ...template.task, end: event.target.value } })}
                        size="small"
                        sx={{ flex: '1 1 140px' }}
                        type="time"
                        value={template.task.end}
                      />
                      <TextField
                        label="Duration (min)"
                        onChange={(event) => updateTemplate(template, { task: { ...template.task, duration: Number(event.target.value) } })}
                        size="small"
                        slotProps={{ htmlInput: { min: 1 } }}
                        sx={{ flex: '1 1 140px' }}
                        type="number"
                        value={template.task.duration}
                      />
                      <TextField
                        label="Power outlet weight"
                        onChange={(event) => updateTemplate(template, { task: { ...template.task, powerOutletRequirement: Number(event.target.value) } })}
                        size="small"
                        slotProps={{ htmlInput: { max: 1, min: 0, step: 0.1 } }}
                        sx={{ flex: '1 1 140px' }}
                        type="number"
                        value={template.task.powerOutletRequirement}
                      />
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }} useFlexGap>
                      <FormControl size="small" sx={{ flex: '1 1 180px', minWidth: 180 }}>
                        <InputLabel>Room type rule</InputLabel>
                        <Select
                          label="Room type rule"
                          onChange={(event) => updateTemplate(template, { task: { ...template.task, roomTypeMode: event.target.value as TaskTemplateRoomTypeMode } })}
                          value={template.task.roomTypeMode}
                        >
                          <MenuItem value="any">Any type</MenuItem>
                          <MenuItem value="include">Require types</MenuItem>
                          <MenuItem value="exclude">Avoid types</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl disabled={template.task.roomTypeMode === 'any'} size="small" sx={{ flex: '2 1 220px', minWidth: 220 }}>
                        <InputLabel>Room types</InputLabel>
                        <Select
                          label="Room types"
                          multiple
                          onChange={(event) => updateTemplate(template, { task: { ...template.task, roomTypes: event.target.value as RoomType[] } })}
                          value={template.task.roomTypes}
                        >
                          {TASK_TEMPLATE_ROOM_TYPES.map((roomType) => (
                            <MenuItem key={roomType} value={roomType}>
                              {roomType.toLowerCase()}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button color="error" onClick={() => void deleteTemplate(template.id)} variant="outlined">
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </Tile>
              ))}
              <Button onClick={addTemplate} variant="outlined">
                Add template
              </Button>
            </Stack>
          </Tile>
        )}
        {currentUser && <PreferenceView currentUser={currentUser} />}
    </Stack>
  );
}
