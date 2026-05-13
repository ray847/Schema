export type ModelType =
  | 'CAMPUS'
  | 'BUILDING'
  | 'BUILDING_EDGE'
  | 'ROOM'
  | 'PERSON'
  | 'COURSE'
  | 'ACTIVITY'
  | 'COURSE_TEACHER'
  | 'ALLOCATION'
  | 'PREFERENCE';

export type PreferenceTargetType = 'CAMPUS' | 'BUILDING' | 'ROOM';

export interface PreferenceRow {
  key: string;
  roomKey: string | null;
  buildingKey: string | null;
  campusKey: string | null;
  value: number;
  targetType?: PreferenceTargetType;
  targetKey?: string | null;
  target?: any;
}

export interface ListPreferenceData {
  listPreference: PreferenceRow[];
}

export interface ListPreferenceVars {
  userKey: string;
}
