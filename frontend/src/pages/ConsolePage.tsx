import { useState, useEffect, useRef } from 'react';
import { Alert, Button, Chip, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import type { CurrentUser } from '../api/authentication';
import { Table } from '../components/Table';
import { Popout } from '../components/Popout';
import { Tile } from '../components/Tile';
import {
  type ModelType,
  type PreferenceTargetType,
  useConsoleData,
} from '../features/console';
interface ConsolePageProps {
  currentUser: CurrentUser | null;
}

interface ConsoleViewProps {
  editable?: boolean;
  currentUser?: CurrentUser | null;
  preferenceOnly?: boolean;
}

export function ConsoleView({ editable = false, currentUser = null, preferenceOnly = false }: ConsoleViewProps) {
  const [selectedModel, setSelectedModel] = useState<ModelType>(preferenceOnly ? 'PREFERENCE' : 'CAMPUS');
  const [currentInsertData, setCurrentInsertData] = useState<Record<string, any>>({});
  const [csvImportError, setCsvImportError] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | undefined>(undefined);
  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, any[]>>({
    CAMPUS: [], BUILDING: [], BUILDING_METADATA: [], BUILDING_EDGE: [], ROOM: [], PERSON: [], COURSE: [], ACTIVITY: [], COURSE_TEACHER: [], ALLOCATION: [], PREFERENCE: [],
  });
  const [pendingDeletions, setPendingDeletions] = useState<Record<string, any[]>>({
    CAMPUS: [], BUILDING: [], BUILDING_METADATA: [], BUILDING_EDGE: [], ROOM: [], PERSON: [], COURSE: [], ACTIVITY: [], COURSE_TEACHER: [], ALLOCATION: [], PREFERENCE: [],
  });
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, Record<string, any>>>({
    CAMPUS: {}, BUILDING: {}, BUILDING_METADATA: {}, BUILDING_EDGE: {}, ROOM: {}, PERSON: {}, COURSE: {}, ACTIVITY: {}, COURSE_TEACHER: {}, ALLOCATION: {}, PREFERENCE: {},
  });

  const baseOptions: { value: ModelType; label: string }[] = [
    { value: 'CAMPUS', label: 'Campuses' }, { value: 'BUILDING', label: 'Buildings' }, { value: 'BUILDING_METADATA', label: 'Building Metadata' }, { value: 'BUILDING_EDGE', label: 'Building Edges' }, { value: 'ROOM', label: 'Rooms' },
    { value: 'PERSON', label: 'People' }, { value: 'COURSE', label: 'Courses' }, { value: 'ACTIVITY', label: 'Activities' },
    { value: 'COURSE_TEACHER', label: 'Course Teachers' }, { value: 'ALLOCATION', label: 'Allocations' },
  ];
  const adminOnlyModels = new Set<ModelType>([
    'BUILDING_METADATA',
    'BUILDING_EDGE',
    'PERSON',
    'ALLOCATION',
  ]);
  const options = preferenceOnly
    ? [{ value: 'PREFERENCE' as const, label: 'Preferences' }]
    : editable
      ? baseOptions
      : baseOptions.filter((option) => !adminOnlyModels.has(option.value));
  const canModifySelectedModel = editable || (selectedModel === 'PREFERENCE' && !!currentUser);
  const preferenceUserKey = currentUser ? String(currentUser.key) : '';

  const [selectionConfig, setSelectionConfig] = useState<{
    isOpen: boolean; model: ModelType; title: string; onSelect: (item: any) => void;
  }>({ isOpen: false, model: 'CAMPUS', title: '', onSelect: () => { }, });

  useEffect(() => { setCurrentInsertData({}); setCsvImportError(null); setEditingKey(undefined); }, [selectedModel]);
  useEffect(() => {
    if (!preferenceOnly && !currentUser && selectedModel === 'PREFERENCE') {
      setSelectedModel('CAMPUS');
    }
  }, [currentUser, preferenceOnly, selectedModel]);
  useEffect(() => {
    if (!options.some((option) => option.value === selectedModel)) {
      setSelectedModel(options[0]?.value ?? 'CAMPUS');
    }
  }, [options, selectedModel]);

  const { queries, mutations } = useConsoleData({
    currentUserKey: preferenceUserKey,
    selectedModel,
    selectionModel: selectionConfig.model,
  });
  const {
    campusQuery,
    buildingQuery,
    buildingMetadataQuery,
    buildingEdgeQuery,
    roomQuery,
    personQuery,
    courseQuery,
    activityQuery,
    courseTeacherQuery,
    allocationQuery,
    preferenceQuery,
  } = queries;
  const {
    createCampus,
    deleteCampus,
    updateCampus,
    createBuilding,
    deleteBuilding,
    updateBuilding,
    createBuildingMetadata,
    deleteBuildingMetadata,
    updateBuildingMetadata,
    createBuildingEdge,
    deleteBuildingEdge,
    updateBuildingEdge,
    createRoom,
    deleteRoom,
    updateRoom,
    createPerson,
    deletePerson,
    updatePerson,
    createCourse,
    deleteCourse,
    updateCourse,
    createActivity,
    deleteActivity,
    updateActivity,
    createCourseTeacher,
    deleteCourseTeacher,
    updateCourseTeacher,
    createAllocation,
    deleteAllocation,
    updateAllocation,
    createPreference,
    deletePreference,
    updatePreference,
  } = mutations;

  const safeJsonParse = (str: string) => { try { return JSON.parse(str || '{}'); } catch { return {}; } };
  const keyValue = (value: any) => value?.key ?? value;
  const csvImportColumns: Partial<Record<ModelType, { header: string; key: string }[]>> = {
    CAMPUS: [
      { header: 'Name', key: 'name' },
      { header: 'Address', key: 'address' },
    ],
    BUILDING: [
      { header: 'Name', key: 'name' },
      { header: 'Type', key: 'buildingType' },
      { header: 'Location', key: 'location' },
      { header: 'Campus', key: 'campusKey' },
    ],
    BUILDING_METADATA: [
      { header: 'Building', key: 'buildingKey' },
      { header: 'X', key: 'relativeX' },
      { header: 'Y', key: 'relativeY' },
      { header: 'Width', key: 'width' },
      { header: 'Depth', key: 'depth' },
      { header: 'Height', key: 'height' },
      { header: 'Rotation', key: 'rotation' },
    ],
    BUILDING_EDGE: [
      { header: 'From', key: 'fromBuildingKey' },
      { header: 'To', key: 'toBuildingKey' },
      { header: 'Walk Time (sec)', key: 'walkTimeSeconds' },
      { header: 'Distance (m)', key: 'distanceMeters' },
      { header: 'Type', key: 'edgeType' },
      { header: 'Two Way', key: 'bidirectional' },
    ],
    ROOM: [
      { header: 'Name', key: 'name' },
      { header: 'Type', key: 'roomType' },
      { header: 'Capacity', key: 'capacity' },
      { header: 'Floor', key: 'floor' },
      { header: 'Facilities (JSON)', key: 'facility' },
      { header: 'Building', key: 'buildingKey' },
    ],
    PERSON: [
      { header: 'Code', key: 'personCode' },
      { header: 'Name', key: 'name' },
      { header: 'Role', key: 'role' },
    ],
    COURSE: [
      { header: 'Code', key: 'courseCode' },
      { header: 'Name', key: 'name' },
    ],
    ACTIVITY: [
      { header: 'Name', key: 'name' },
      { header: 'Host', key: 'personKey' },
    ],
    COURSE_TEACHER: [
      { header: 'Teacher', key: 'personKey' },
      { header: 'Course', key: 'courseKey' },
      { header: 'Responsibility', key: 'responsibility' },
    ],
    ALLOCATION: [
      { header: 'Event Type', key: 'eventType' },
      { header: 'Event', key: 'eventKey' },
      { header: 'Start Time', key: 'startTime' },
      { header: 'End Time', key: 'endTime' },
      { header: 'Room', key: 'roomKey' },
    ],
  };

  const parseCsv = (content: string) => {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let inQuotes = false;

    for (let index = 0; index < content.length; index += 1) {
      const char = content[index];
      const next = content[index + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          cell += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(cell.trim());
        cell = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && next === '\n') index += 1;
        row.push(cell.trim());
        if (row.some(value => value.length > 0)) rows.push(row);
        row = [];
        cell = '';
      } else {
        cell += char;
      }
    }

    row.push(cell.trim());
    if (row.some(value => value.length > 0)) rows.push(row);
    return rows;
  };
  const formatDateTime = (dt: any) => {
    if (!dt) return '';
    const d = new Date(dt);
    if (isNaN(d.getTime())) return String(dt);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(d).replace(',', '');
  };
  const parseDateTimeInput = (value: string) => {
    const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})$/);
    if (!match) return value;

    const [, dayRaw, monthRaw, yearRaw, hourRaw, minuteRaw] = match;
    const day = Number(dayRaw);
    const month = Number(monthRaw);
    const year = Number(yearRaw);
    const hour = Number(hourRaw);
    const minute = Number(minuteRaw);
    const date = new Date(year, month - 1, day, hour, minute);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day ||
      date.getHours() !== hour ||
      date.getMinutes() !== minute
    ) {
      return value;
    }
    return date.toISOString();
  };

  const findByKey = (items: any[] | undefined, key: any) =>
    items?.find(item => String(item.key) === String(key));

  const renderModelReference = (model: any, fallbackKey?: any) => {
    const key = model?.key ?? fallbackKey ?? (typeof model === 'object' ? undefined : model);
    const label = model?.name ?? model?.courseCode ?? (key ? `#${key}` : '-');

    return (
      <span className="font-semibold">
        {label}
        {editable && key != null && (
          <span className="ml-2 font-mono text-xs font-normal text-gray-500">
            #{key}
          </span>
        )}
      </span>
    );
  };

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

  const preferenceRows = preferenceQuery.data?.listPreference.map(preference => {
    const targetType = getPreferenceTargetType(preference);
    const targetKey = getPreferenceTargetKey(preference, targetType);
    const target = getPreferenceTarget(targetType, targetKey);
    return {
      ...preference,
      targetType,
      targetKey,
      target: target ? { ...target, targetType } : undefined,
    };
  });

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

  const handleConfirmInsert = (item: Record<string, any>) => {
    const newItem = { ...item, key: `pending-${selectedModel}-${pendingChanges[selectedModel].length}` };
    setPendingChanges(prev => ({ ...prev, [selectedModel]: [...prev[selectedModel], newItem] }));
    setCurrentInsertData({});
  };

  const handleCsvImport = async (file: File | null) => {
    if (!file) return;

    try {
      const importColumns = csvImportColumns[selectedModel];
      if (!importColumns) {
        setCsvImportError('CSV import is not available for this table.');
        return;
      }

      const rows = parseCsv(await file.text());
      if (rows.length < 2) {
        setCsvImportError('The CSV file must contain a header row and at least one data row.');
        return;
      }

      const [headers, ...dataRows] = rows;
      const expectedHeaders = importColumns.map(column => column.header);
      const headerMatches =
        headers.length === expectedHeaders.length &&
        headers.every((header, index) => header === expectedHeaders[index]);

      if (!headerMatches) {
        setCsvImportError(`CSV headers must be exactly: ${expectedHeaders.join(', ')}`);
        return;
      }

      const importedRows = dataRows.map((row, rowIndex) => {
        if (row.length !== importColumns.length) {
          throw new Error(`Row ${rowIndex + 2} has ${row.length} columns, expected ${importColumns.length}.`);
        }

        const item: Record<string, any> = {
          key: `pending-${selectedModel}-csv-${Date.now()}-${rowIndex}`,
        };

        importColumns.forEach((column, columnIndex) => {
          item[column.key] = row[columnIndex];
        });

        return item;
      });

      setPendingChanges(prev => ({ ...prev, [selectedModel]: [...prev[selectedModel], ...importedRows] }));
      setCsvImportError(null);
    } catch (error) {
      setCsvImportError(error instanceof Error ? error.message : 'Unable to import CSV file.');
    }
  };

  const handleUndoInsert = (item: any) => { setPendingChanges(prev => ({ ...prev, [selectedModel]: prev[selectedModel].filter(p => p.key !== item.key) })); };

  const handleConfirmDelete = (item: any) => { setPendingDeletions(prev => ({ ...prev, [selectedModel]: [...prev[selectedModel], item] })); };

  const handleUndoDelete = (item: any) => { setPendingDeletions(prev => ({ ...prev, [selectedModel]: prev[selectedModel].filter(p => p.key !== item.key) })); };

  const handleUndoUpdate = (item: any) => {
    setPendingUpdates(prev => {
      const next = { ...prev[selectedModel] };
      delete next[item.key];
      return { ...prev, [selectedModel]: next };
    });
  };

  const handleSaveEdit = (item: any, data: Record<string, any>) => {
    setPendingUpdates(prev => ({ ...prev, [selectedModel]: { ...prev[selectedModel], [item.key]: data } }));
    setEditingKey(undefined);
  };

  const handleApply = async () => {
    const pendingInsert = pendingChanges[selectedModel];
    const pendingDelete = pendingDeletions[selectedModel];
    const pendingUpdate = pendingUpdates[selectedModel];

    if (pendingInsert.length === 0 && pendingDelete.length === 0 && Object.keys(pendingUpdate).length === 0) return;

    // Handle Deletions
    if (pendingDelete.length > 0) {
      for (const item of pendingDelete) {
        if (selectedModel === 'PREFERENCE' && currentUser) {
          await deletePreference({ variables: { userKey: preferenceUserKey, preferenceKey: item.key } });
        } else if (selectedModel === 'COURSE_TEACHER') { await deleteCourseTeacher({ variables: { courseKey: item.courseKey, personKey: item.personKey } }); }
        else {
          const vars = { variables: { key: item.key } };
          switch (selectedModel) {
            case 'CAMPUS': await deleteCampus(vars); break;
            case 'BUILDING': await deleteBuilding(vars); break;
            case 'BUILDING_METADATA': await deleteBuildingMetadata(vars); break;
            case 'BUILDING_EDGE': await deleteBuildingEdge(vars); break;
            case 'ROOM': await deleteRoom(vars); break;
            case 'PERSON': await deletePerson(vars); break;
            case 'COURSE': await deleteCourse(vars); break;
            case 'ACTIVITY': await deleteActivity(vars); break;
            case 'ALLOCATION': await deleteAllocation(vars); break;
          }
        }
      }
    }

    // Handle Updates
    for (const [key, replacements] of Object.entries(pendingUpdate)) {
      if (selectedModel === 'PREFERENCE' && currentUser) {
        await updatePreference({
          variables: {
            userKey: preferenceUserKey,
            preferenceKey: key,
            input: buildPreferenceInput(replacements),
          },
        });
        continue;
      }

      const formatted = { ...replacements };
      const originalCourseKey = formatted.courseKey?.key || formatted.courseKey;
      const originalPersonKey = formatted.personKey?.key || formatted.personKey;

      if (formatted.campusKey?.key) formatted.campusKey = formatted.campusKey.key;
      if (formatted.buildingKey?.key) formatted.buildingKey = formatted.buildingKey.key;
      for (const key of ['relativeX', 'relativeY', 'width', 'depth', 'height', 'rotation']) {
        if (formatted[key] !== undefined && formatted[key] !== '') formatted[key] = parseFloat(formatted[key]);
      }
      if (formatted.fromBuildingKey?.key) formatted.fromBuildingKey = formatted.fromBuildingKey.key;
      if (formatted.toBuildingKey?.key) formatted.toBuildingKey = formatted.toBuildingKey.key;
      if (formatted.personKey?.key) formatted.personKey = formatted.personKey.key;
      if (formatted.courseKey?.key) formatted.courseKey = formatted.courseKey.key;
      if (formatted.eventKey?.key) formatted.eventKey = formatted.eventKey.key;
      if (formatted.roomKey?.key) formatted.roomKey = formatted.roomKey.key;
      if (formatted.capacity) formatted.capacity = parseInt(formatted.capacity) || 0;
      if (formatted.floor) formatted.floor = parseInt(formatted.floor) || 1;
      if (formatted.walkTimeSeconds) formatted.walkTimeSeconds = parseInt(formatted.walkTimeSeconds) || 0;
      if (formatted.distanceMeters === '') formatted.distanceMeters = null;
      else if (formatted.distanceMeters != null) formatted.distanceMeters = parseFloat(formatted.distanceMeters);
      if (formatted.eventKey && selectedModel === 'ALLOCATION' && typeof formatted.eventKey === 'string') formatted.eventKey = parseInt(formatted.eventKey) || 0;
      if (formatted.startTime && selectedModel === 'ALLOCATION') formatted.startTime = parseDateTimeInput(String(formatted.startTime));
      if (formatted.endTime && selectedModel === 'ALLOCATION') formatted.endTime = parseDateTimeInput(String(formatted.endTime));
      if (formatted.facility && typeof formatted.facility === 'string') formatted.facility = safeJsonParse(formatted.facility);

      if (selectedModel === 'COURSE_TEACHER') {
        await updateCourseTeacher({ variables: { courseKey: originalCourseKey, personKey: originalPersonKey, replacements: { responsibility: formatted.responsibility } } });
      } else {
        const vars = { variables: { key, replacements: formatted } };
        switch (selectedModel) {
          case 'CAMPUS': await updateCampus(vars); break;
          case 'BUILDING': await updateBuilding(vars); break;
          case 'BUILDING_METADATA': await updateBuildingMetadata(vars); break;
          case 'BUILDING_EDGE': await updateBuildingEdge(vars); break;
          case 'ROOM': await updateRoom(vars); break;
          case 'PERSON': await updatePerson(vars); break;
          case 'COURSE': await updateCourse(vars); break;
          case 'ACTIVITY': await updateActivity(vars); break;
          case 'ALLOCATION': await updateAllocation(vars); break;
        }
      }
    }

    // Handle Insertions
    if (pendingInsert.length > 0) {
      switch (selectedModel) {
        case 'CAMPUS': await createCampus({ variables: { inputs: pendingInsert.map(p => ({ name: p.name, address: p.address })) } }); break;
        case 'BUILDING': await createBuilding({ variables: { inputs: pendingInsert.map(p => ({ name: p.name, buildingType: p.buildingType, location: p.location, campusKey: keyValue(p.campusKey) })) } }); break;
        case 'BUILDING_METADATA': await createBuildingMetadata({ variables: { inputs: pendingInsert.map(p => ({ buildingKey: keyValue(p.buildingKey), relativeX: parseFloat(p.relativeX) || 0, relativeY: parseFloat(p.relativeY) || 0, width: parseFloat(p.width) || 1, depth: parseFloat(p.depth) || 1, height: parseFloat(p.height) || 1, rotation: parseFloat(p.rotation) || 0 })) } }); break;
        case 'BUILDING_EDGE': await createBuildingEdge({ variables: { inputs: pendingInsert.map(p => ({ fromBuildingKey: keyValue(p.fromBuildingKey), toBuildingKey: keyValue(p.toBuildingKey), walkTimeSeconds: parseInt(p.walkTimeSeconds) || 0, distanceMeters: p.distanceMeters === '' || p.distanceMeters == null ? null : parseFloat(p.distanceMeters), edgeType: p.edgeType || 'WALKWAY', bidirectional: p.bidirectional !== false && p.bidirectional !== 'false' })) } }); break;
        case 'ROOM': await createRoom({ variables: { inputs: pendingInsert.map(p => ({ name: p.name, roomType: p.roomType, capacity: parseInt(p.capacity) || 0, floor: parseInt(p.floor) || 1, facility: safeJsonParse(p.facility), buildingKey: keyValue(p.buildingKey) })) } }); break;
        case 'PERSON': await createPerson({ variables: { inputs: pendingInsert.map(p => ({ personCode: p.personCode, name: p.name, role: p.role })) } }); break;
        case 'COURSE': await createCourse({ variables: { inputs: pendingInsert.map(p => ({ courseCode: p.courseCode, name: p.name })) } }); break;
        case 'ACTIVITY': await createActivity({ variables: { inputs: pendingInsert.map(p => ({ name: p.name, personKey: keyValue(p.personKey) })) } }); break;
        case 'COURSE_TEACHER': await createCourseTeacher({ variables: { inputs: pendingInsert.map(p => ({ personKey: keyValue(p.personKey), courseKey: keyValue(p.courseKey), responsibility: p.responsibility })) } }); break;
        case 'ALLOCATION': await createAllocation({ variables: { inputs: pendingInsert.map(p => ({ eventType: p.eventType, eventKey: parseInt(keyValue(p.eventKey)) || 0, startTime: parseDateTimeInput(String(p.startTime || '')), endTime: parseDateTimeInput(String(p.endTime || '')), roomKey: keyValue(p.roomKey) })) } }); break;
        case 'PREFERENCE':
          if (currentUser) {
            for (const preference of pendingInsert) {
              await createPreference({
                variables: {
                  userKey: preferenceUserKey,
                  input: buildPreferenceInput(preference),
                },
              });
            }
          }
          break;
      }
    }

    if (selectedModel === 'PREFERENCE' && currentUser) {
      await preferenceQuery.refetch({ userKey: preferenceUserKey });
    }

    setPendingChanges(prev => ({ ...prev, [selectedModel]: [] }));
    setPendingDeletions(prev => ({ ...prev, [selectedModel]: [] }));
    setPendingUpdates(prev => ({ ...prev, [selectedModel]: {} }));
  };

  const renderSelectionTable = () => {
    switch (selectionConfig.model) {
      case 'CAMPUS': return (<Table showKey={editable} data={campusQuery.data?.listCampus} loading={campusQuery.loading} error={campusQuery.error} onSelect={(item) => { selectionConfig.onSelect(item); setSelectionConfig({ ...selectionConfig, isOpen: false }); }} columns={[{ header: 'Key', render: (c) => <span className="text-xs font-mono text-gray-500">{c.key}</span> }, { header: 'Name', render: (c) => <span className="font-semibold">{c.name}</span> }, { header: 'Address', render: (c) => c.address },]} />);
      case 'BUILDING': return (<Table showKey={editable} data={buildingQuery.data?.listBuilding} loading={buildingQuery.loading} error={buildingQuery.error} onSelect={(item) => { selectionConfig.onSelect(item); setSelectionConfig({ ...selectionConfig, isOpen: false }); }} columns={[{ header: 'Key', render: (b) => <span className="text-xs font-mono text-gray-500">{b.key}</span> }, { header: 'Name', render: (b) => <span className="font-semibold">{b.name}</span> }, { header: 'Campus', render: (b) => renderModelReference(b.campus, b.campusKey) },]} />);
      case 'ROOM': return (<Table showKey={editable} data={roomQuery.data?.listRoom} loading={roomQuery.loading} error={roomQuery.error} onSelect={(item) => { selectionConfig.onSelect(item); setSelectionConfig({ ...selectionConfig, isOpen: false }); }} columns={[{ header: 'Key', render: (r) => <span className="text-xs font-mono text-gray-500">{r.key}</span> }, { header: 'Name', render: (r) => <span className="font-semibold">{r.name}</span> }, { header: 'Building', render: (r) => renderModelReference(r.building, r.buildingKey) },]} />);
      case 'PERSON': return (<Table showKey={editable} data={personQuery.data?.listPerson} loading={personQuery.loading} error={personQuery.error} onSelect={(item) => { selectionConfig.onSelect(item); setSelectionConfig({ ...selectionConfig, isOpen: false }); }} columns={[{ header: 'Key', render: (p) => <span className="text-xs font-mono text-gray-500">{p.key}</span> }, { header: 'Name', render: (p) => <span className="font-semibold">{p.name}</span> }, { header: 'Role', render: (p) => p.role },]} />);
      case 'COURSE': return (<Table showKey={editable} data={courseQuery.data?.listCourse} loading={courseQuery.loading} error={courseQuery.error} onSelect={(item) => { selectionConfig.onSelect(item); setSelectionConfig({ ...selectionConfig, isOpen: false }); }} columns={[{ header: 'Key', render: (c) => <span className="text-xs font-mono text-gray-500">{c.key}</span> }, { header: 'Code', render: (c) => <span className="font-mono">{c.courseCode}</span> }, { header: 'Name', render: (c) => <span className="font-semibold">{c.name}</span> },]} />);
      case 'ACTIVITY': return (<Table showKey={editable} data={activityQuery.data?.listActivity} loading={activityQuery.loading} error={activityQuery.error} onSelect={(item) => { selectionConfig.onSelect(item); setSelectionConfig({ ...selectionConfig, isOpen: false }); }} columns={[{ header: 'Key', render: (a) => <span className="text-xs font-mono text-gray-500">{a.key}</span> }, { header: 'Name', render: (a) => <span className="font-semibold">{a.name}</span> },]} />);
      default: return null;
    }
  };

  const renderPreferenceTargetType = (targetType?: PreferenceTargetType) => {
    if (targetType === 'ROOM') return 'Room';
    if (targetType === 'BUILDING') return 'Building';
    if (targetType === 'CAMPUS') return 'Campus';
    return '';
  };

  const renderPreferenceTarget = (preference: Record<string, any>) => {
    const targetType = getPreferenceTargetType(preference);
    const targetKey = getPreferenceTargetKey(preference, targetType);
    const target = preference.target || getPreferenceTarget(targetType, targetKey);
    if (target?.name) return renderModelReference(target, targetKey);
    if (targetKey) return renderModelReference(undefined, targetKey);
    return <span className="text-gray-400">No target</span>;
  };

  const renderEnumSelect = (
    value: any,
    onChange: (value: any) => void,
    options: { value: string; label: string }[],
    placeholder = 'Select Type',
  ) => (
    <FormControl fullWidth size="small">
      <Select
        displayEmpty
        onChange={(event) => onChange(event.target.value)}
        sx={{
          color: 'text.primary',
          '& .MuiSelect-select': {
            color: 'text.primary',
          },
          '& .MuiSvgIcon-root': {
            color: 'text.secondary',
          },
        }}
        value={value ?? ''}
      >
        <MenuItem value="">{placeholder}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderPreferenceTable = (tableProps: Record<string, any>) => (
    <Table
      {...tableProps}
      data={preferenceRows}
      loading={preferenceQuery.loading}
      error={preferenceQuery.error}
      columns={[
        { header: 'Key', render: (p) => <span className="text-xs font-mono text-gray-500">{p.key}</span> },
        {
          header: 'Target Type',
          inputKey: 'target',
          renderInput: (val, onChange) => (
            <FormControl fullWidth size="small">
              <Select
              displayEmpty
              value={val?.targetType || ''}
              onChange={(e) => onChange({ targetType: e.target.value })}
            >
              <MenuItem value="">Select Target</MenuItem>
              <MenuItem value="CAMPUS">Campus</MenuItem>
              <MenuItem value="BUILDING">Building</MenuItem>
              <MenuItem value="ROOM">Room</MenuItem>
            </Select>
            </FormControl>
          ),
          render: (p) => <span>{renderPreferenceTargetType(getPreferenceTargetType(p))}</span>,
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
                sx={{
                  justifyContent: 'space-between',
                  minHeight: 40,
                  textAlign: 'left',
                  width: 1,
                }}
                variant="outlined"
              >
                <span>
                  {selectedTarget?.name || (targetType ? `Pick ${renderPreferenceTargetType(targetType)}...` : 'Pick type first')}
                </span>
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
              type="number"
              size="small"
              slotProps={{ htmlInput: { max: 1, min: -1, step: 0.1 } }}
              value={val ?? ''}
              onChange={(e) => onChange(e.target.value)}
            />
          ),
          render: (p) => <span className="tabular-nums">{Number(p.value).toFixed(2)}</span>,
        },
      ]}
    />
  );

  const renderContent = () => {
    const tableProps = canModifySelectedModel
      ? {
        insertData: currentInsertData,
        onInsertDataChange: setCurrentInsertData,
        onInsert: handleConfirmInsert,
        onDelete: handleConfirmDelete,
        onUndoInsert: handleUndoInsert,
        onUndoDelete: handleUndoDelete,
        onUndoUpdate: handleUndoUpdate,
        onEdit: (item: any) => setEditingKey(item.key),
        onSaveEdit: handleSaveEdit,
        onCancelEdit: () => setEditingKey(undefined),
        editingKey,
        pendingData: pendingChanges[selectedModel],
        pendingDeleteKeys: pendingDeletions[selectedModel].map(p => p.key),
        pendingUpdateKeys: Object.keys(pendingUpdates[selectedModel]),
        showKey: editable,
        striped: true,
      }
      : {
        showKey: editable,
        striped: true,
      };

    if (selectedModel === 'PREFERENCE') {
      return renderPreferenceTable(tableProps);
    }

    switch (selectedModel) {
      case 'CAMPUS': return (<Table {...tableProps} data={campusQuery.data?.listCampus} loading={campusQuery.loading} error={campusQuery.error} columns={[{ header: 'Key', render: (c) => <span className="text-xs font-mono text-gray-500">{c.key}</span> }, { header: 'Name', inputKey: 'name', render: (c) => <span className="font-semibold">{c.name}</span> }, { header: 'Address', inputKey: 'address', render: (c) => c.address },]} />);
      case 'BUILDING': return (<Table {...tableProps} data={buildingQuery.data?.listBuilding} loading={buildingQuery.loading} error={buildingQuery.error} columns={[{ header: 'Key', render: (b) => <span className="text-xs font-mono text-gray-500">{b.key}</span> }, { header: 'Name', inputKey: 'name', render: (b) => <span className="font-semibold">{b.name}</span> }, { header: 'Type', inputKey: 'buildingType', renderInput: (val, onChange) => renderEnumSelect(val, onChange, [{ value: 'ACADEMIC', label: 'Academic' }, { value: 'CAFETERIA', label: 'Cafeteria' }, { value: 'LIBRARY', label: 'Library' }, { value: 'OTHER', label: 'Other' }]), render: (b) => <span className="capitalize">{b.buildingType.toLowerCase()}</span> }, { header: 'Location', inputKey: 'location', render: (b) => b.location }, { header: 'Campus', inputKey: 'campusKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'CAMPUS', title: 'Select Campus', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Select Campus...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (b) => renderModelReference(b.campus, b.campusKey) },]} />);
      case 'BUILDING_METADATA': return (<Table {...tableProps} data={buildingMetadataQuery.data?.listBuildingMetadata} loading={buildingMetadataQuery.loading} error={buildingMetadataQuery.error} columns={[{ header: 'Key', render: (m) => <span className="text-xs font-mono text-gray-500">{m.key}</span> }, { header: 'Building', inputKey: 'buildingKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'BUILDING', title: 'Select Building', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Select building...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (m) => renderModelReference(m.building, m.buildingKey) }, { header: 'X', inputKey: 'relativeX', render: (m) => <span className="tabular-nums">{m.relativeX}</span> }, { header: 'Y', inputKey: 'relativeY', render: (m) => <span className="tabular-nums">{m.relativeY}</span> }, { header: 'Width', inputKey: 'width', render: (m) => <span className="tabular-nums">{m.width}</span> }, { header: 'Depth', inputKey: 'depth', render: (m) => <span className="tabular-nums">{m.depth}</span> }, { header: 'Height', inputKey: 'height', render: (m) => <span className="tabular-nums">{m.height}</span> }, { header: 'Rotation', inputKey: 'rotation', render: (m) => <span className="tabular-nums">{m.rotation}</span> },]} />);
      case 'BUILDING_EDGE': return (<Table {...tableProps} data={buildingEdgeQuery.data?.listBuildingEdge} loading={buildingEdgeQuery.loading} error={buildingEdgeQuery.error} columns={[{ header: 'Key', render: (e) => <span className="text-xs font-mono text-gray-500">{e.key}</span> }, { header: 'From', inputKey: 'fromBuildingKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'BUILDING', title: 'Select From Building', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Select building...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (e) => renderModelReference(e.fromBuilding, e.fromBuildingKey) }, { header: 'To', inputKey: 'toBuildingKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'BUILDING', title: 'Select To Building', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Select building...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (e) => renderModelReference(e.toBuilding, e.toBuildingKey) }, { header: 'Walk Time (sec)', inputKey: 'walkTimeSeconds', renderInput: (val, onChange) => (<input type="number" min="1" className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={val ?? ''} onChange={(event) => onChange(event.target.value)} />), render: (e) => <span className="tabular-nums">{e.walkTimeSeconds}</span> }, { header: 'Distance (m)', inputKey: 'distanceMeters', renderInput: (val, onChange) => (<input type="number" min="0" step="0.1" className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={val ?? ''} onChange={(event) => onChange(event.target.value)} />), render: (e) => <span className="tabular-nums">{e.distanceMeters ?? '-'}</span> }, { header: 'Type', inputKey: 'edgeType', renderInput: (val, onChange) => renderEnumSelect(val || 'WALKWAY', onChange, [{ value: 'WALKWAY', label: 'Walkway' }, { value: 'INDOOR', label: 'Indoor' }, { value: 'STAIRS', label: 'Stairs' }, { value: 'SHUTTLE', label: 'Shuttle' }, { value: 'OTHER', label: 'Other' }]), render: (e) => <span className="capitalize">{(e.edgeType ?? 'WALKWAY').toLowerCase()}</span> }, { header: 'Two Way', inputKey: 'bidirectional', renderInput: (val, onChange) => renderEnumSelect(String(val ?? true), (value) => onChange(value === 'true'), [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }], 'Two Way'), render: (e) => e.bidirectional !== false ? 'Yes' : 'No' },]} />);
      case 'ROOM': return (<Table {...tableProps} data={roomQuery.data?.listRoom} loading={roomQuery.loading} error={roomQuery.error} columns={[{ header: 'Key', render: (r) => <span className="text-xs font-mono text-gray-500">{r.key}</span> }, { header: 'Name', inputKey: 'name', render: (r) => <span className="font-semibold">{r.name}</span> }, { header: 'Type', inputKey: 'roomType', renderInput: (val, onChange) => renderEnumSelect(val, onChange, [{ value: 'AUDITORIUM', label: 'Auditorium' }, { value: 'LABORATORY', label: 'Laboratory' }, { value: 'LECTURE', label: 'Lecture' }, { value: 'OFFICE', label: 'Office' }, { value: 'OTHER', label: 'Other' }]), render: (r) => <span className="capitalize">{r.roomType.toLowerCase()}</span> }, { header: 'Capacity', inputKey: 'capacity', render: (r) => <span className="tabular-nums">{r.capacity}</span> }, { header: 'Floor', inputKey: 'floor', renderInput: (val, onChange) => (<input type="number" className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={val ?? ''} onChange={(e) => onChange(e.target.value)} />), render: (r) => <span className="tabular-nums">{r.floor}</span> }, { header: 'Facilities (JSON)', inputKey: 'facility', renderInput: (val, onChange) => (<input type="text" className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder='{"power_outlet": 2}' value={typeof val === 'object' ? JSON.stringify(val) : val || ''} onChange={(e) => onChange(e.target.value)} />), render: (r) => (<div className="flex flex-wrap gap-2">{(r.facility as any)?.power_outlet > 0 && (<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">🔌 {(r.facility as any).power_outlet} Outlets</span>)}</div>) }, { header: 'Building', inputKey: 'buildingKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'BUILDING', title: 'Select Building', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Select Building...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (r) => renderModelReference(r.building, r.buildingKey) },]} />);
      case 'PERSON': return (<Table {...tableProps} data={personQuery.data?.listPerson} loading={personQuery.loading} error={personQuery.error} columns={[{ header: 'Key', render: (p) => <span className="text-xs font-mono text-gray-500">{p.key}</span> }, { header: 'Code', inputKey: 'personCode', render: (p) => <span className="font-mono">{p.personCode}</span> }, { header: 'Name', inputKey: 'name', render: (p) => <span className="font-semibold">{p.name}</span> }, { header: 'Role', inputKey: 'role', render: (p) => p.role },]} />);
      case 'COURSE': return (<Table {...tableProps} data={courseQuery.data?.listCourse} loading={courseQuery.loading} error={courseQuery.error} columns={[{ header: 'Key', render: (c) => <span className="text-xs font-mono text-gray-500">{c.key}</span> }, { header: 'Code', inputKey: 'courseCode', render: (c) => <span className="font-mono">{c.courseCode}</span> }, { header: 'Name', inputKey: 'name', render: (c) => <span className="font-semibold">{c.name}</span> },]} />);
      case 'ACTIVITY': return (<Table {...tableProps} data={activityQuery.data?.listActivity} loading={activityQuery.loading} error={activityQuery.error} columns={[{ header: 'Key', render: (a) => <span className="text-xs font-mono text-gray-500">{a.key}</span> }, { header: 'Name', inputKey: 'name', render: (a) => <span className="font-semibold">{a.name}</span> }, { header: 'Host', inputKey: 'personKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'PERSON', title: 'Select Host', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Pick a Host...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (a) => renderModelReference(a.person, a.personKey) },]} />);
      case 'COURSE_TEACHER': return (<Table {...tableProps} data={courseTeacherQuery.data?.listCourseTeacher.map((ct: any, i: number) => ({ ...ct, key: `${ct.personKey}-${ct.courseKey}-${i}` }))} loading={courseTeacherQuery.loading} error={courseTeacherQuery.error} columns={[{ header: 'Teacher', inputKey: 'personKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'PERSON', title: 'Select Teacher', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Pick a Teacher...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (ct) => renderModelReference(ct.person, ct.personKey) }, { header: 'Course', inputKey: 'courseKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'COURSE', title: 'Select Course', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Pick a Course...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (ct) => renderModelReference(ct.course, ct.courseKey) }, { header: 'Responsibility', inputKey: 'responsibility', render: (ct) => ct.responsibility },]} />);
      case 'ALLOCATION': return (<Table {...tableProps} data={allocationQuery.data?.listAllocation} loading={allocationQuery.loading} error={allocationQuery.error} columns={[{ header: 'Key', render: (a) => <span className="text-xs font-mono text-gray-500">{a.key}</span> }, { header: 'Event Type', inputKey: 'eventType', renderInput: (val, onChange) => renderEnumSelect(val, onChange, [{ value: 'ACTIVITY', label: 'Activity' }, { value: 'COURSE', label: 'Course' }]), render: (a) => <span className="capitalize">{a.eventType.toLowerCase()}</span> }, { header: 'Event', inputKey: 'eventKey', renderInput: (val, onChange, rowData) => (<button disabled={!rowData.eventType} onClick={() => setSelectionConfig({ isOpen: true, model: rowData.eventType as ModelType, title: `Select ${rowData.eventType}`, onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 disabled:bg-gray-50 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || (rowData.eventType ? `Pick ${rowData.eventType}...` : 'Pick type first')}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (a) => { if (typeof a.eventKey === 'object' && (a.eventKey as any).name) return renderModelReference(a.eventKey); const idStr = String(a.eventKey); if (a.eventType === 'COURSE') { const course = courseQuery.data?.listCourse.find((c: any) => c.key === idStr); return renderModelReference(course, idStr); } if (a.eventType === 'ACTIVITY') { const activity = activityQuery.data?.listActivity.find((act: any) => act.key === idStr); return renderModelReference(activity, idStr); } return renderModelReference(undefined, idStr); } }, { header: 'Start Time', inputKey: 'startTime', renderInput: (val, onChange) => (<input type="text" inputMode="numeric" className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="dd/mm/yyyy HH:mm" value={formatDateTime(val)} onChange={(e) => onChange(parseDateTimeInput(e.target.value))} />), render: (a) => <span className="tabular-nums">{formatDateTime(a.startTime)}</span> }, { header: 'End Time', inputKey: 'endTime', renderInput: (val, onChange) => (<input type="text" inputMode="numeric" className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="dd/mm/yyyy HH:mm" value={formatDateTime(val)} onChange={(e) => onChange(parseDateTimeInput(e.target.value))} />), render: (a) => <span className="tabular-nums">{formatDateTime(a.endTime)}</span> }, { header: 'Room', inputKey: 'roomKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'ROOM', title: 'Select Room', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Select Room...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (a) => renderModelReference(a.room, a.roomKey) },]} />);
    }
  };

  const hasPendingChanges = pendingChanges[selectedModel].length > 0;
  const hasPendingDeletions = pendingDeletions[selectedModel].length > 0;
  const hasPendingUpdates = Object.keys(pendingUpdates[selectedModel]).length > 0;
  const hasTotalPending = hasPendingChanges || hasPendingDeletions || hasPendingUpdates;
  const renderControls = () => (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3 flex-wrap">
        {preferenceOnly ? (
          null
        ) : (
          <FormControl
            size="small"
            sx={{
              minWidth: 240,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'transparent',
              },
              '& .MuiOutlinedInput-root.Mui-focused': {
                bgcolor: 'transparent',
              },
            }}
          >
            <InputLabel id="console-table-select-label">Table</InputLabel>
            <Select
              label="Table"
              labelId="console-table-select-label"
              onChange={(event) => setSelectedModel(event.target.value as ModelType)}
              value={selectedModel}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {hasTotalPending && (
          <div className="flex gap-2">
            {hasPendingChanges && <Chip color="warning" label={`${pendingChanges[selectedModel].length} pending insert`} size="small" variant="outlined" />}
            {hasPendingDeletions && <Chip color="error" label={`${pendingDeletions[selectedModel].length} pending delete`} size="small" variant="outlined" />}
            {hasPendingUpdates && <Chip color="info" label={`${Object.keys(pendingUpdates[selectedModel]).length} pending update`} size="small" variant="outlined" />}
          </div>
        )}
      </div>
      {canModifySelectedModel && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {editable && !preferenceOnly && (
            <>
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv,text/csv"
                hidden
                onChange={(event) => {
                  void handleCsvImport(event.target.files?.[0] ?? null);
                  event.target.value = '';
                }}
              />
              <Button onClick={() => csvInputRef.current?.click()} size="small" variant="outlined">
                Import CSV
              </Button>
            </>
          )}
          <Button onClick={handleApply} disabled={!hasTotalPending} size="small" variant="contained">
            Apply changes
          </Button>
        </Stack>
      )}
    </div>
  );

  if (preferenceOnly) {
    return (
      <div className="space-y-8">
        {csvImportError && <Alert severity="error">{csvImportError}</Alert>}
        <Tile component="section">
          <Stack spacing={2}>
            <Typography variant="h6">Preferences</Typography>
            {renderControls()}
            {renderContent()}
          </Stack>
        </Tile>
        <Popout isOpen={selectionConfig.isOpen} onClose={() => setSelectionConfig({ ...selectionConfig, isOpen: false })} title={selectionConfig.title} className="max-w-4xl"><div className="space-y-4"><p className="text-sm text-gray-600">Please select an entry to populate the field.</p><div className="border border-gray-100 rounded-xl overflow-hidden shadow-inner bg-gray-50/30">{renderSelectionTable()}</div></div></Popout>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tile component="section" sx={{ p: 2 }}>
        {renderControls()}
      </Tile>
      {csvImportError && <Alert severity="error">{csvImportError}</Alert>}
      <Tile component="section">
        {renderContent()}
      </Tile>
      <Popout isOpen={selectionConfig.isOpen} onClose={() => setSelectionConfig({ ...selectionConfig, isOpen: false })} title={selectionConfig.title} className="max-w-4xl"><div className="space-y-4"><p className="text-sm text-gray-600">Please select an entry to populate the field.</p><div className="border border-gray-100 rounded-xl overflow-hidden shadow-inner bg-gray-50/30">{renderSelectionTable()}</div></div></Popout>
    </div>
  );
}

export function ConsolePage({ currentUser }: ConsolePageProps) {
  const isAdmin = currentUser?.type === 'admin';

  return (
    <Stack spacing={3}>
      {!isAdmin && (
        <Alert severity={currentUser ? 'info' : 'warning'}>
          {currentUser
            ? 'Your preference table is available to edit. Other tables remain admin-only.'
            : 'Sign in with an admin account to insert, update, or delete rows.'}
        </Alert>
      )}
      <ConsoleView editable={isAdmin} currentUser={currentUser} />
    </Stack>
  );
}
