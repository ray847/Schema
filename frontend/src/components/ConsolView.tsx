import { useQuery } from '@apollo/client/react';
import { useState } from 'react';
import { graphql } from '../generated/gql';
import { Table } from './Table';
import { Selector } from './Selector';

const LIST_CAMPUS = graphql(`
  query ListCampus {
    listCampus {
      key
      name
      address
    }
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
        name
      }
    }
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
        name
      }
    }
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

const LIST_COURSE = graphql(`
  query ListCourse {
    listCourse {
      key
      courseCode
      name
    }
  }
`);

const LIST_ACTIVITY = graphql(`
  query ListActivity {
    listActivity {
      key
      name
      person {
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
        name
      }
      course {
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
        name
        building {
          name
        }
      }
    }
  }
`);

type ModelType = 'CAMPUS' | 'BUILDING' | 'ROOM' | 'PERSON' | 'COURSE' | 'ACTIVITY' | 'COURSE_TEACHER' | 'ALLOCATION';

export function ConsolView() {
  const [selectedModel, setSelectedModel] = useState<ModelType>('CAMPUS');

  // Queries
  const campusQuery = useQuery(LIST_CAMPUS, { skip: selectedModel !== 'CAMPUS' });
  const buildingQuery = useQuery(LIST_BUILDING, { skip: selectedModel !== 'BUILDING' });
  const roomQuery = useQuery(LIST_ROOM, { skip: selectedModel !== 'ROOM' });
  const personQuery = useQuery(LIST_PERSON, { skip: selectedModel !== 'PERSON' });
  const courseQuery = useQuery(LIST_COURSE, { skip: selectedModel !== 'COURSE' });
  const activityQuery = useQuery(LIST_ACTIVITY, { skip: selectedModel !== 'ACTIVITY' });
  const courseTeacherQuery = useQuery(LIST_COURSE_TEACHER, { skip: selectedModel !== 'COURSE_TEACHER' });
  const allocationQuery = useQuery(LIST_ALLOCATION, { skip: selectedModel !== 'ALLOCATION' });

  const options: { value: ModelType; label: string }[] = [
    { value: 'CAMPUS', label: 'Campuses' },
    { value: 'BUILDING', label: 'Buildings' },
    { value: 'ROOM', label: 'Rooms' },
    { value: 'PERSON', label: 'People' },
    { value: 'COURSE', label: 'Courses' },
    { value: 'ACTIVITY', label: 'Activities' },
    { value: 'COURSE_TEACHER', label: 'Course Teachers' },
    { value: 'ALLOCATION', label: 'Allocations' },
  ];

  const renderContent = () => {
    switch (selectedModel) {
      case 'CAMPUS':
        return (
          <Table 
            data={campusQuery.data?.listCampus}
            loading={campusQuery.loading}
            error={campusQuery.error}
            striped
            columns={[
              { header: 'Key', render: (c) => <span className="text-xs font-mono text-gray-500">{c.key}</span> },
              { header: 'Name', render: (c) => <span className="font-semibold">{c.name}</span> },
              { header: 'Address', render: (c) => c.address },
            ]}
          />
        );
      case 'BUILDING':
        return (
          <Table 
            data={buildingQuery.data?.listBuilding}
            loading={buildingQuery.loading}
            error={buildingQuery.error}
            striped
            columns={[
              { header: 'Key', render: (b) => <span className="text-xs font-mono text-gray-500">{b.key}</span> },
              { header: 'Name', render: (b) => <span className="font-semibold">{b.name}</span> },
              { header: 'Type', render: (b) => <span className="capitalize">{b.buildingType.toLowerCase()}</span> },
              { header: 'Location', render: (b) => b.location },
              { header: 'Campus', render: (b) => <span className="text-primary font-medium">{b.campus.name}</span> },
            ]}
          />
        );
      case 'ROOM':
        return (
          <Table 
            data={roomQuery.data?.listRoom}
            loading={roomQuery.loading}
            error={roomQuery.error}
            striped
            columns={[
              { header: 'Key', render: (r) => <span className="text-xs font-mono text-gray-500">{r.key}</span> },
              { header: 'Name', render: (r) => <span className="font-semibold">{r.name}</span> },
              { header: 'Type', render: (r) => <span className="capitalize">{r.roomType.toLowerCase()}</span> },
              { header: 'Capacity', render: (r) => <span className="tabular-nums">{r.capacity}</span> },
              { 
                header: 'Facilities', 
                render: (r) => (
                  <div className="flex flex-wrap gap-2">
                    {(r.facility as any)?.power_outlet > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        🔌 {(r.facility as any).power_outlet} Outlets
                      </span>
                    )}
                  </div>
                )
              },
              { header: 'Building', render: (r) => <span className="text-primary font-medium">{r.building.name}</span> },
            ]}
          />
        );
      case 'PERSON':
        return (
          <Table 
            data={personQuery.data?.listPerson}
            loading={personQuery.loading}
            error={personQuery.error}
            striped
            columns={[
              { header: 'Key', render: (p) => <span className="text-xs font-mono text-gray-500">{p.key}</span> },
              { header: 'Code', render: (p) => <span className="font-mono">{p.personCode}</span> },
              { header: 'Name', render: (p) => <span className="font-semibold">{p.name}</span> },
              { header: 'Role', render: (p) => p.role },
            ]}
          />
        );
      case 'COURSE':
        return (
          <Table 
            data={courseQuery.data?.listCourse}
            loading={courseQuery.loading}
            error={courseQuery.error}
            striped
            columns={[
              { header: 'Key', render: (c) => <span className="text-xs font-mono text-gray-500">{c.key}</span> },
              { header: 'Code', render: (c) => <span className="font-mono">{c.courseCode}</span> },
              { header: 'Name', render: (c) => <span className="font-semibold">{c.name}</span> },
            ]}
          />
        );
      case 'ACTIVITY':
        return (
          <Table 
            data={activityQuery.data?.listActivity}
            loading={activityQuery.loading}
            error={activityQuery.error}
            striped
            columns={[
              { header: 'Key', render: (a) => <span className="text-xs font-mono text-gray-500">{a.key}</span> },
              { header: 'Name', render: (a) => <span className="font-semibold">{a.name}</span> },
              { header: 'Host', render: (a) => <span className="text-primary font-medium">{a.person.name}</span> },
            ]}
          />
        );
      case 'COURSE_TEACHER':
        return (
          <Table 
            data={courseTeacherQuery.data?.listCourseTeacher.map((ct, i) => ({ ...ct, key: `${ct.personKey}-${ct.courseKey}-${i}` }))}
            loading={courseTeacherQuery.loading}
            error={courseTeacherQuery.error}
            striped
            columns={[
              { header: 'Teacher', render: (ct) => <span className="font-semibold">{ct.person.name}</span> },
              { header: 'Course', render: (ct) => <span className="text-primary font-medium">{ct.course.name}</span> },
              { header: 'Responsibility', render: (ct) => ct.responsibility },
            ]}
          />
        );
      case 'ALLOCATION':
        return (
          <Table 
            data={allocationQuery.data?.listAllocation}
            loading={allocationQuery.loading}
            error={allocationQuery.error}
            striped
            columns={[
              { header: 'Key', render: (a) => <span className="text-xs font-mono text-gray-500">{a.key}</span> },
              { header: 'Event', render: (a) => <span className="capitalize">{a.eventType.toLowerCase()} (ID: {a.eventKey})</span> },
              { header: 'Time', render: (a) => <span className="tabular-nums">{a.startTime} - {a.endTime}</span> },
              { header: 'Room', render: (a) => <span className="font-medium">{a.room.name}</span> },
              { header: 'Building', render: (a) => <span className="text-gray-500">{a.room.building.name}</span> },
            ]}
          />
        );
    }
  };

  return (
    <div className="space-y-8">
      <Selector
        value={selectedModel}
        options={options}
        onChange={setSelectedModel}
        intent="primary"
      />

      <section>
        <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-800">
          {options.find(opt => opt.value === selectedModel)?.label}
        </h2>
        {renderContent()}
      </section>
    </div>
  );
}
