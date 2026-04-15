import { useQuery, useMutation } from '@apollo/client/react';
import { useState, useEffect } from 'react';
import { graphql } from '../generated/gql';
import { Table } from './Table';
import { Selector } from './Selector';
import { Popout } from './Popout';

const LIST_CAMPUS = graphql(`
  query ListCampus {
    listCampus {
      key
      name
      address
    }
  }
`);

const CREATE_CAMPUS = graphql(`
  mutation CreateCampus($inputs: [CampusInput!]!) {
    createCampus(inputs: $inputs)
  }
`);

const DELETE_CAMPUS = graphql(`
  mutation DeleteCampus($key: ID!) {
    deleteCampus(key: $key)
  }
`);

const UPDATE_CAMPUS = graphql(`
  mutation UpdateCampus($key: ID!, $replacements: JSON!) {
    updateCampus(key: $key, replacements: $replacements)
  }
`);

const LIST_BUILDING = graphql(`
  query ListBuilding {
    listBuilding {
      key
      name
      buildingType
      location
      campus {
        key
        name
      }
    }
  }
`);

const CREATE_BUILDING = graphql(`
  mutation CreateBuilding($inputs: [BuildingInput!]!) {
    createBuilding(inputs: $inputs)
  }
`);

const DELETE_BUILDING = graphql(`
  mutation DeleteBuilding($key: ID!) {
    deleteBuilding(key: $key)
  }
`);

const UPDATE_BUILDING = graphql(`
  mutation UpdateBuilding($key: ID!, $replacements: JSON!) {
    updateBuilding(key: $key, replacements: $replacements)
  }
`);

const LIST_ROOM = graphql(`
  query ListRoom {
    listRoom {
      key
      name
      roomType
      capacity
      facility
      building {
        key
        name
      }
    }
  }
`);

const CREATE_ROOM = graphql(`
  mutation CreateRoom($inputs: [RoomInput!]!) {
    createRoom(inputs: $inputs)
  }
`);

const DELETE_ROOM = graphql(`
  mutation DeleteRoom($key: ID!) {
    deleteRoom(key: $key)
  }
`);

const UPDATE_ROOM = graphql(`
  mutation UpdateRoom($key: ID!, $replacements: JSON!) {
    updateRoom(key: $key, replacements: $replacements)
  }
`);

const LIST_PERSON = graphql(`
  query ListPerson {
    listPerson {
      key
      personCode
      name
      role
    }
  }
`);

const CREATE_PERSON = graphql(`
  mutation CreatePerson($inputs: [PersonInput!]!) {
    createPerson(inputs: $inputs)
  }
`);

const DELETE_PERSON = graphql(`
  mutation DeletePerson($key: ID!) {
    deletePerson(key: $key)
  }
`);

const UPDATE_PERSON = graphql(`
  mutation UpdatePerson($key: ID!, $replacements: JSON!) {
    updatePerson(key: $key, replacements: $replacements)
  }
`);

const LIST_COURSE = graphql(`
  query ListCourse {
    listCourse {
      key
      courseCode
      name
    }
  }
`);

const CREATE_COURSE = graphql(`
  mutation CreateCourse($inputs: [CourseInput!]!) {
    createCourse(inputs: $inputs)
  }
`);

const DELETE_COURSE = graphql(`
  mutation DeleteCourse($key: ID!) {
    deleteCourse(key: $key)
  }
`);

const UPDATE_COURSE = graphql(`
  mutation UpdateCourse($key: ID!, $replacements: JSON!) {
    updateCourse(key: $key, replacements: $replacements)
  }
`);

const CREATE_ACTIVITY = graphql(`
  mutation CreateActivity($inputs: [ActivityInput!]!) {
    createActivity(inputs: $inputs)
  }
`);

const DELETE_ACTIVITY = graphql(`
  mutation DeleteActivity($key: ID!) {
    deleteActivity(key: $key)
  }
`);

const UPDATE_ACTIVITY = graphql(`
  mutation UpdateActivity($key: ID!, $replacements: JSON!) {
    updateActivity(key: $key, replacements: $replacements)
  }
`);

const CREATE_COURSE_TEACHER = graphql(`
  mutation CreateCourseTeacher($inputs: [CourseTeacherInput!]!) {
    createCourseTeacher(inputs: $inputs)
  }
`);

const DELETE_COURSE_TEACHER = graphql(`
  mutation DeleteCourseTeacher($courseKey: ID!, $personKey: ID!) {
    deleteCourseTeacher(courseKey: $courseKey, personKey: $personKey)
  }
`);

const UPDATE_COURSE_TEACHER = graphql(`
  mutation UpdateCourseTeacher($courseKey: ID!, $personKey: ID!, $replacements: JSON!) {
    updateCourseTeacher(courseKey: $courseKey, personKey: $personKey, replacements: $replacements)
  }
`);

const CREATE_ALLOCATION = graphql(`
  mutation CreateAllocation($inputs: [AllocationInput!]!) {
    createAllocation(inputs: $inputs)
  }
`);

const DELETE_ALLOCATION = graphql(`
  mutation DeleteAllocation($key: ID!) {
    deleteAllocation(key: $key)
  }
`);

const UPDATE_ALLOCATION = graphql(`
  mutation UpdateAllocation($key: ID!, $replacements: JSON!) {
    updateAllocation(key: $key, replacements: $replacements)
  }
`);

const LIST_ACTIVITY = graphql(`
  query ListActivity {
    listActivity {
      key
      name
      person {
        key
        name
      }
    }
  }
`);

const LIST_COURSE_TEACHER = graphql(`
  query ListCourseTeacher {
    listCourseTeacher {
      personKey
      courseKey
      responsibility
      person {
        key
        name
      }
      course {
        key
        name
      }
    }
  }
`);

const LIST_ALLOCATION = graphql(`
  query ListAllocation {
    listAllocation {
      key
      eventType
      eventKey
      startTime
      endTime
      room {
        key
        name
        building {
          key
          name
        }
      }
    }
  }
`);

type ModelType = 'CAMPUS' | 'BUILDING' | 'ROOM' | 'PERSON' | 'COURSE' | 'ACTIVITY' | 'COURSE_TEACHER' | 'ALLOCATION';

export function ConsoleView() {
  const [selectedModel, setSelectedModel] = useState<ModelType>('CAMPUS');
  const [currentInsertData, setCurrentInsertData] = useState<Record<string, any>>({});
  const [editingKey, setEditingKey] = useState<string | undefined>(undefined);
  const [pendingChanges, setPendingChanges] = useState<Record<string, any[]>>({
    CAMPUS: [], BUILDING: [], ROOM: [], PERSON: [], COURSE: [], ACTIVITY: [], COURSE_TEACHER: [], ALLOCATION: [],
  });
  const [pendingDeletions, setPendingDeletions] = useState<Record<string, any[]>>({
    CAMPUS: [], BUILDING: [], ROOM: [], PERSON: [], COURSE: [], ACTIVITY: [], COURSE_TEACHER: [], ALLOCATION: [],
  });
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, Record<string, any>>>({
    CAMPUS: {}, BUILDING: {}, ROOM: {}, PERSON: {}, COURSE: {}, ACTIVITY: {}, COURSE_TEACHER: {}, ALLOCATION: {},
  });

  const options: { value: ModelType; label: string }[] = [
    { value: 'CAMPUS', label: 'Campuses' }, { value: 'BUILDING', label: 'Buildings' }, { value: 'ROOM', label: 'Rooms' },
    { value: 'PERSON', label: 'People' }, { value: 'COURSE', label: 'Courses' }, { value: 'ACTIVITY', label: 'Activities' },
    { value: 'COURSE_TEACHER', label: 'Course Teachers' }, { value: 'ALLOCATION', label: 'Allocations' },
  ];

  const [selectionConfig, setSelectionConfig] = useState<{
    isOpen: boolean; model: ModelType; title: string; onSelect: (item: any) => void;
  }>({ isOpen: false, model: 'CAMPUS', title: '', onSelect: () => {}, });

  useEffect(() => { setCurrentInsertData({}); setEditingKey(undefined); }, [selectedModel]);

  const campusQuery = useQuery(LIST_CAMPUS, { skip: selectedModel !== 'CAMPUS' && selectionConfig.model !== 'CAMPUS' });
  const buildingQuery = useQuery(LIST_BUILDING, { skip: selectedModel !== 'BUILDING' && selectionConfig.model !== 'BUILDING' });
  const roomQuery = useQuery(LIST_ROOM, { skip: selectedModel !== 'ROOM' && selectionConfig.model !== 'ROOM' });
  const personQuery = useQuery(LIST_PERSON, { skip: selectedModel !== 'PERSON' && selectionConfig.model !== 'PERSON' });
  const courseQuery = useQuery(LIST_COURSE, { skip: selectedModel !== 'COURSE' && selectionConfig.model !== 'COURSE' && selectedModel !== 'ALLOCATION' });
  const activityQuery = useQuery(LIST_ACTIVITY, { skip: selectedModel !== 'ACTIVITY' && selectionConfig.model !== 'ACTIVITY' && selectedModel !== 'ALLOCATION' });
  const courseTeacherQuery = useQuery(LIST_COURSE_TEACHER, { skip: selectedModel !== 'COURSE_TEACHER' });
  const allocationQuery = useQuery(LIST_ALLOCATION, { skip: selectedModel !== 'ALLOCATION' });

  const [createCampus] = useMutation(CREATE_CAMPUS, { refetchQueries: [{ query: LIST_CAMPUS }] });
  const [deleteCampus] = useMutation(DELETE_CAMPUS, { refetchQueries: [{ query: LIST_CAMPUS }] });
  const [updateCampus] = useMutation(UPDATE_CAMPUS, { refetchQueries: [{ query: LIST_CAMPUS }] });
  
  const [createBuilding] = useMutation(CREATE_BUILDING, { refetchQueries: [{ query: LIST_BUILDING }] });
  const [deleteBuilding] = useMutation(DELETE_BUILDING, { refetchQueries: [{ query: LIST_BUILDING }] });
  const [updateBuilding] = useMutation(UPDATE_BUILDING, { refetchQueries: [{ query: LIST_BUILDING }] });
  
  const [createRoom] = useMutation(CREATE_ROOM, { refetchQueries: [{ query: LIST_ROOM }] });
  const [deleteRoom] = useMutation(DELETE_ROOM, { refetchQueries: [{ query: LIST_ROOM }] });
  const [updateRoom] = useMutation(UPDATE_ROOM, { refetchQueries: [{ query: LIST_ROOM }] });
  
  const [createPerson] = useMutation(CREATE_PERSON, { refetchQueries: [{ query: LIST_PERSON }] });
  const [deletePerson] = useMutation(DELETE_PERSON, { refetchQueries: [{ query: LIST_PERSON }] });
  const [updatePerson] = useMutation(UPDATE_PERSON, { refetchQueries: [{ query: LIST_PERSON }] });
  
  const [createCourse] = useMutation(CREATE_COURSE, { refetchQueries: [{ query: LIST_COURSE }] });
  const [deleteCourse] = useMutation(DELETE_COURSE, { refetchQueries: [{ query: LIST_COURSE }] });
  const [updateCourse] = useMutation(UPDATE_COURSE, { refetchQueries: [{ query: LIST_COURSE }] });
  
  const [createActivity] = useMutation(CREATE_ACTIVITY, { refetchQueries: [{ query: LIST_ACTIVITY }] });
  const [deleteActivity] = useMutation(DELETE_ACTIVITY, { refetchQueries: [{ query: LIST_ACTIVITY }] });
  const [updateActivity] = useMutation(UPDATE_ACTIVITY, { refetchQueries: [{ query: LIST_ACTIVITY }] });
  
  const [createCourseTeacher] = useMutation(CREATE_COURSE_TEACHER, { refetchQueries: [{ query: LIST_COURSE_TEACHER }] });
  const [deleteCourseTeacher] = useMutation(DELETE_COURSE_TEACHER, { refetchQueries: [{ query: LIST_COURSE_TEACHER }] });
  const [updateCourseTeacher] = useMutation(UPDATE_COURSE_TEACHER, { refetchQueries: [{ query: LIST_COURSE_TEACHER }] });
  
  const [createAllocation] = useMutation(CREATE_ALLOCATION, { refetchQueries: [{ query: LIST_ALLOCATION }] });
  const [deleteAllocation] = useMutation(DELETE_ALLOCATION, { refetchQueries: [{ query: LIST_ALLOCATION }] });
  const [updateAllocation] = useMutation(UPDATE_ALLOCATION, { refetchQueries: [{ query: LIST_ALLOCATION }] });

  const safeJsonParse = (str: string) => { try { return JSON.parse(str || '{}'); } catch (e) { return {}; } };
  const formatDateTime = (dt: any) => { if (!dt) return ''; const d = new Date(dt); return isNaN(d.getTime()) ? String(dt) : d.toLocaleString(); };

  const handleConfirmInsert = (item: Record<string, any>) => {
    const newItem = { ...item, key: `pending-${Date.now()}-${pendingChanges[selectedModel].length}` };
    setPendingChanges(prev => ({ ...prev, [selectedModel]: [...prev[selectedModel], newItem] }));
    setCurrentInsertData({});
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
        if (selectedModel === 'COURSE_TEACHER') { await deleteCourseTeacher({ variables: { courseKey: item.courseKey, personKey: item.personKey } }); } 
        else {
          const vars = { variables: { key: item.key } };
          switch (selectedModel) {
            case 'CAMPUS': await deleteCampus(vars); break;
            case 'BUILDING': await deleteBuilding(vars); break;
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
      const formatted = { ...replacements };
      const originalCourseKey = formatted.courseKey?.key || formatted.courseKey;
      const originalPersonKey = formatted.personKey?.key || formatted.personKey;

      if (formatted.campusKey?.key) formatted.campusKey = formatted.campusKey.key;
      if (formatted.buildingKey?.key) formatted.buildingKey = formatted.buildingKey.key;
      if (formatted.personKey?.key) formatted.personKey = formatted.personKey.key;
      if (formatted.courseKey?.key) formatted.courseKey = formatted.courseKey.key;
      if (formatted.eventKey?.key) formatted.eventKey = formatted.eventKey.key;
      if (formatted.roomKey?.key) formatted.roomKey = formatted.roomKey.key;
      if (formatted.capacity) formatted.capacity = parseInt(formatted.capacity) || 0;
      if (formatted.eventKey && selectedModel === 'ALLOCATION' && typeof formatted.eventKey === 'string') formatted.eventKey = parseInt(formatted.eventKey) || 0;
      if (formatted.facility && typeof formatted.facility === 'string') formatted.facility = safeJsonParse(formatted.facility);

      if (selectedModel === 'COURSE_TEACHER') {
        await updateCourseTeacher({ variables: { courseKey: originalCourseKey, personKey: originalPersonKey, replacements: { responsibility: formatted.responsibility } } });
      } else {
        const vars = { variables: { key, replacements: formatted } };
        switch (selectedModel) {
          case 'CAMPUS': await updateCampus(vars); break;
          case 'BUILDING': await updateBuilding(vars); break;
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
        case 'BUILDING': await createBuilding({ variables: { inputs: pendingInsert.map(p => ({ name: p.name, buildingType: p.buildingType, location: p.location, campusKey: p.campusKey?.key })) } }); break;
        case 'ROOM': await createRoom({ variables: { inputs: pendingInsert.map(p => ({ name: p.name, roomType: p.roomType, capacity: parseInt(p.capacity) || 0, facility: safeJsonParse(p.facility), buildingKey: p.buildingKey?.key })) } }); break;
        case 'PERSON': await createPerson({ variables: { inputs: pendingInsert.map(p => ({ personCode: p.personCode, name: p.name, role: p.role })) } }); break;
        case 'COURSE': await createCourse({ variables: { inputs: pendingInsert.map(p => ({ courseCode: p.courseCode, name: p.name })) } }); break;
        case 'ACTIVITY': await createActivity({ variables: { inputs: pendingInsert.map(p => ({ name: p.name, personKey: p.personKey?.key })) } }); break;
        case 'COURSE_TEACHER': await createCourseTeacher({ variables: { inputs: pendingInsert.map(p => ({ personKey: p.personKey?.key, courseKey: p.courseKey?.key, responsibility: p.responsibility })) } }); break;
        case 'ALLOCATION': await createAllocation({ variables: { inputs: pendingInsert.map(p => ({ eventType: p.eventType, eventKey: parseInt(p.eventKey?.key) || 0, startTime: p.startTime, endTime: p.endTime, roomKey: p.roomKey?.key })) } }); break;
      }
    }

    setPendingChanges(prev => ({ ...prev, [selectedModel]: [] }));
    setPendingDeletions(prev => ({ ...prev, [selectedModel]: [] }));
    setPendingUpdates(prev => ({ ...prev, [selectedModel]: {} }));
  };

  const renderSelectionTable = () => {
    switch (selectionConfig.model) {
      case 'CAMPUS': return (<Table data={campusQuery.data?.listCampus} loading={campusQuery.loading} error={campusQuery.error} onSelect={(item) => { selectionConfig.onSelect(item); setSelectionConfig({ ...selectionConfig, isOpen: false }); }} columns={[{ header: 'Name', render: (c) => <span className="font-semibold">{c.name}</span> }, { header: 'Address', render: (c) => c.address },]} />);
      case 'BUILDING': return (<Table data={buildingQuery.data?.listBuilding} loading={buildingQuery.loading} error={buildingQuery.error} onSelect={(item) => { selectionConfig.onSelect(item); setSelectionConfig({ ...selectionConfig, isOpen: false }); }} columns={[{ header: 'Name', render: (b) => <span className="font-semibold">{b.name}</span> }, { header: 'Campus', render: (b) => b.campus.name },]} />);
      case 'ROOM': return (<Table data={roomQuery.data?.listRoom} loading={roomQuery.loading} error={roomQuery.error} onSelect={(item) => { selectionConfig.onSelect(item); setSelectionConfig({ ...selectionConfig, isOpen: false }); }} columns={[{ header: 'Name', render: (r) => <span className="font-semibold">{r.name}</span> }, { header: 'Building', render: (r) => r.building.name },]} />);
      case 'PERSON': return (<Table data={personQuery.data?.listPerson} loading={personQuery.loading} error={personQuery.error} onSelect={(item) => { selectionConfig.onSelect(item); setSelectionConfig({ ...selectionConfig, isOpen: false }); }} columns={[{ header: 'Name', render: (p) => <span className="font-semibold">{p.name}</span> }, { header: 'Role', render: (p) => p.role },]} />);
      case 'COURSE': return (<Table data={courseQuery.data?.listCourse} loading={courseQuery.loading} error={courseQuery.error} onSelect={(item) => { selectionConfig.onSelect(item); setSelectionConfig({ ...selectionConfig, isOpen: false }); }} columns={[{ header: 'Code', render: (c) => <span className="font-mono">{c.courseCode}</span> }, { header: 'Name', render: (c) => <span className="font-semibold">{c.name}</span> },]} />);
      case 'ACTIVITY': return (<Table data={activityQuery.data?.listActivity} loading={activityQuery.loading} error={activityQuery.error} onSelect={(item) => { selectionConfig.onSelect(item); setSelectionConfig({ ...selectionConfig, isOpen: false }); }} columns={[{ header: 'Name', render: (a) => <span className="font-semibold">{a.name}</span> },]} />);
      default: return null;
    }
  };

  const renderContent = () => {
    const tableProps = {
      insertData: currentInsertData, onInsertDataChange: setCurrentInsertData, onInsert: handleConfirmInsert,
      onDelete: handleConfirmDelete,
      onUndoInsert: handleUndoInsert, onUndoDelete: handleUndoDelete, onUndoUpdate: handleUndoUpdate,
      onEdit: (item: any) => setEditingKey(item.key),
      onSaveEdit: handleSaveEdit, onCancelEdit: () => setEditingKey(undefined), editingKey,
      pendingData: pendingChanges[selectedModel], 
      pendingDeleteKeys: pendingDeletions[selectedModel].map(p => p.key),
      pendingUpdateKeys: Object.keys(pendingUpdates[selectedModel]),
      striped: true,
    };

    switch (selectedModel) {
      case 'CAMPUS': return (<Table {...tableProps} data={campusQuery.data?.listCampus} loading={campusQuery.loading} error={campusQuery.error} columns={[{ header: 'Key', render: (c) => <span className="text-xs font-mono text-gray-500">{c.key}</span> }, { header: 'Name', inputKey: 'name', render: (c) => <span className="font-semibold">{c.name}</span> }, { header: 'Address', inputKey: 'address', render: (c) => c.address },]} />);
      case 'BUILDING': return (<Table {...tableProps} data={buildingQuery.data?.listBuilding} loading={buildingQuery.loading} error={buildingQuery.error} columns={[{ header: 'Key', render: (b) => <span className="text-xs font-mono text-gray-500">{b.key}</span> }, { header: 'Name', inputKey: 'name', render: (b) => <span className="font-semibold">{b.name}</span> }, { header: 'Type', inputKey: 'buildingType', renderInput: (val, onChange) => (<select className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={val || ''} onChange={(e) => onChange(e.target.value)}><option value="">Select Type</option><option value="ACADEMIC">Academic</option><option value="CAFETERIA">Cafeteria</option><option value="LIBRARY">Library</option><option value="OTHER">Other</option></select>), render: (b) => <span className="capitalize">{b.buildingType.toLowerCase()}</span> }, { header: 'Location', inputKey: 'location', render: (b) => b.location }, { header: 'Campus', inputKey: 'campusKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'CAMPUS', title: 'Select Campus', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Select Campus...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (b) => <span className="text-primary font-medium">{(b.campus || b.campusKey)?.name}</span> },]} />);
      case 'ROOM': return (<Table {...tableProps} data={roomQuery.data?.listRoom} loading={roomQuery.loading} error={roomQuery.error} columns={[{ header: 'Key', render: (r) => <span className="text-xs font-mono text-gray-500">{r.key}</span> }, { header: 'Name', inputKey: 'name', render: (r) => <span className="font-semibold">{r.name}</span> }, { header: 'Type', inputKey: 'roomType', renderInput: (val, onChange) => (<select className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={val || ''} onChange={(e) => onChange(e.target.value)}><option value="">Select Type</option><option value="AUDITORIUM">Auditorium</option><option value="LABORATORY">Laboratory</option><option value="LECTURE">Lecture</option><option value="OFFICE">Office</option><option value="OTHER">Other</option></select>), render: (r) => <span className="capitalize">{r.roomType.toLowerCase()}</span> }, { header: 'Capacity', inputKey: 'capacity', render: (r) => <span className="tabular-nums">{r.capacity}</span> }, { header: 'Facilities (JSON)', inputKey: 'facility', renderInput: (val, onChange) => (<input type="text" className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder='{"power_outlet": 2}' value={typeof val === 'object' ? JSON.stringify(val) : val || ''} onChange={(e) => onChange(e.target.value)} />), render: (r) => (<div className="flex flex-wrap gap-2">{(r.facility as any)?.power_outlet > 0 && (<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">🔌 {(r.facility as any).power_outlet} Outlets</span>)}</div>) }, { header: 'Building', inputKey: 'buildingKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'BUILDING', title: 'Select Building', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Select Building...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (r) => <span className="text-primary font-medium">{(r.building || r.buildingKey)?.name}</span> },]} />);
      case 'PERSON': return (<Table {...tableProps} data={personQuery.data?.listPerson} loading={personQuery.loading} error={personQuery.error} columns={[{ header: 'Key', render: (p) => <span className="text-xs font-mono text-gray-500">{p.key}</span> }, { header: 'Code', inputKey: 'personCode', render: (p) => <span className="font-mono">{p.personCode}</span> }, { header: 'Name', inputKey: 'name', render: (p) => <span className="font-semibold">{p.name}</span> }, { header: 'Role', inputKey: 'role', render: (p) => p.role },]} />);
      case 'COURSE': return (<Table {...tableProps} data={courseQuery.data?.listCourse} loading={courseQuery.loading} error={courseQuery.error} columns={[{ header: 'Key', render: (c) => <span className="text-xs font-mono text-gray-500">{c.key}</span> }, { header: 'Code', inputKey: 'courseCode', render: (c) => <span className="font-mono">{c.courseCode}</span> }, { header: 'Name', inputKey: 'name', render: (c) => <span className="font-semibold">{c.name}</span> },]} />);
      case 'ACTIVITY': return (<Table {...tableProps} data={activityQuery.data?.listActivity} loading={activityQuery.loading} error={activityQuery.error} columns={[{ header: 'Key', render: (a) => <span className="text-xs font-mono text-gray-500">{a.key}</span> }, { header: 'Name', inputKey: 'name', render: (a) => <span className="font-semibold">{a.name}</span> }, { header: 'Host', inputKey: 'personKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'PERSON', title: 'Select Host', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Pick a Host...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (a) => <span className="text-primary font-medium">{(a.person || a.personKey)?.name}</span> },]} />);
      case 'COURSE_TEACHER': return (<Table {...tableProps} data={courseTeacherQuery.data?.listCourseTeacher.map((ct, i) => ({ ...ct, key: `${ct.personKey}-${ct.courseKey}-${i}` }))} loading={courseTeacherQuery.loading} error={courseTeacherQuery.error} columns={[{ header: 'Teacher', inputKey: 'personKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'PERSON', title: 'Select Teacher', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Pick a Teacher...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (ct) => <span className="font-semibold">{(ct.person || ct.personKey)?.name}</span> }, { header: 'Course', inputKey: 'courseKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'COURSE', title: 'Select Course', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Pick a Course...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (ct) => <span className="text-primary font-medium">{(ct.course || ct.courseKey)?.name}</span> }, { header: 'Responsibility', inputKey: 'responsibility', render: (ct) => ct.responsibility },]} />);
      case 'ALLOCATION': return (<Table {...tableProps} data={allocationQuery.data?.listAllocation} loading={allocationQuery.loading} error={allocationQuery.error} columns={[{ header: 'Key', render: (a) => <span className="text-xs font-mono text-gray-500">{a.key}</span> }, { header: 'Event Type', inputKey: 'eventType', renderInput: (val, onChange) => (<select className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={val || ''} onChange={(e) => onChange(e.target.value)}><option value="">Select Type</option><option value="ACTIVITY">Activity</option><option value="COURSE">Course</option></select>), render: (a) => <span className="capitalize">{a.eventType.toLowerCase()}</span> }, { header: 'Event', inputKey: 'eventKey', renderInput: (val, onChange, rowData) => (<button disabled={!rowData.eventType} onClick={() => setSelectionConfig({ isOpen: true, model: rowData.eventType as ModelType, title: `Select ${rowData.eventType}`, onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 disabled:bg-gray-50 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || (rowData.eventType ? `Pick ${rowData.eventType}...` : 'Pick type first')}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (a) => { if (typeof a.eventKey === 'object' && (a.eventKey as any).name) return <span className="font-medium">{(a.eventKey as any).name}</span>; const idStr = String(a.eventKey); if (a.eventType === 'COURSE') { const course = courseQuery.data?.listCourse.find(c => c.key === idStr); return <span className="font-medium text-blue-600">{course ? course.name : `Course #${idStr}`}</span>; } if (a.eventType === 'ACTIVITY') { const activity = activityQuery.data?.listActivity.find(act => act.key === idStr); return <span className="font-medium text-green-600">{activity ? activity.name : `Activity #${idStr}`}</span>; } return <span className="font-medium text-gray-400">{idStr}</span>; } }, { header: 'Start Time', inputKey: 'startTime', renderInput: (val, onChange) => (<input type="datetime-local" className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={val ? new Date(val).toISOString().slice(0, 16) : ''} onChange={(e) => onChange(new Date(e.target.value).toISOString())} />), render: (a) => <span className="tabular-nums">{formatDateTime(a.startTime)}</span> }, { header: 'End Time', inputKey: 'endTime', renderInput: (val, onChange) => (<input type="datetime-local" className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={val ? new Date(val).toISOString().slice(0, 16) : ''} onChange={(e) => onChange(new Date(e.target.value).toISOString())} />), render: (a) => <span className="tabular-nums">{formatDateTime(a.endTime)}</span> }, { header: 'Room', inputKey: 'roomKey', renderInput: (val, onChange) => (<button onClick={() => setSelectionConfig({ isOpen: true, model: 'ROOM', title: 'Select Room', onSelect: onChange })} className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-left border-gray-200 hover:border-blue-500 transition-colors flex justify-between items-center"><span className={val?.name ? 'text-gray-900 font-medium' : 'text-gray-400'}>{val?.name || val || 'Select Room...'}</span><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>), render: (a) => <span className="font-medium">{(a.room || a.roomKey)?.name}</span> },]} />);
    }
  };

  const hasPendingChanges = pendingChanges[selectedModel].length > 0;
  const hasPendingDeletions = pendingDeletions[selectedModel].length > 0;
  const hasPendingUpdates = Object.keys(pendingUpdates[selectedModel]).length > 0;
  const hasTotalPending = hasPendingChanges || hasPendingDeletions || hasPendingUpdates;

  return (
    <div className="space-y-8">
      <Selector value={selectedModel} options={options} onChange={setSelectedModel} intent="primary" />
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-gray-800">{options.find(opt => opt.value === selectedModel)?.label}</h2>
            {hasTotalPending && (
              <div className="flex gap-2">
                {hasPendingChanges && <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">{pendingChanges[selectedModel].length} pending insert</span>}
                {hasPendingDeletions && <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">{pendingDeletions[selectedModel].length} pending delete</span>}
                {hasPendingUpdates && <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">{Object.keys(pendingUpdates[selectedModel]).length} pending update</span>}
              </div>
            )}
          </div>
          <button onClick={handleApply} disabled={!hasTotalPending} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Apply Changes</button>
        </div>
        {renderContent()}
      </section>
      <Popout isOpen={selectionConfig.isOpen} onClose={() => setSelectionConfig({ ...selectionConfig, isOpen: false })} title={selectionConfig.title} className="max-w-4xl"><div className="space-y-4"><p className="text-sm text-gray-600">Please select an entry to populate the field.</p><div className="border border-gray-100 rounded-xl overflow-hidden shadow-inner bg-gray-50/30">{renderSelectionTable()}</div></div></Popout>
    </div>
  );
}
