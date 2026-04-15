/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query ListCampus {\n    listCampus {\n      key\n      name\n      address\n    }\n  }\n": typeof types.ListCampusDocument,
    "\n  mutation CreateCampus($inputs: [CampusInput!]!) {\n    createCampus(inputs: $inputs)\n  }\n": typeof types.CreateCampusDocument,
    "\n  mutation DeleteCampus($key: ID!) {\n    deleteCampus(key: $key)\n  }\n": typeof types.DeleteCampusDocument,
    "\n  mutation UpdateCampus($key: ID!, $replacements: JSON!) {\n    updateCampus(key: $key, replacements: $replacements)\n  }\n": typeof types.UpdateCampusDocument,
    "\n  query ListBuilding {\n    listBuilding {\n      key\n      name\n      buildingType\n      location\n      campus {\n        key\n        name\n      }\n    }\n  }\n": typeof types.ListBuildingDocument,
    "\n  mutation CreateBuilding($inputs: [BuildingInput!]!) {\n    createBuilding(inputs: $inputs)\n  }\n": typeof types.CreateBuildingDocument,
    "\n  mutation DeleteBuilding($key: ID!) {\n    deleteBuilding(key: $key)\n  }\n": typeof types.DeleteBuildingDocument,
    "\n  mutation UpdateBuilding($key: ID!, $replacements: JSON!) {\n    updateBuilding(key: $key, replacements: $replacements)\n  }\n": typeof types.UpdateBuildingDocument,
    "\n  query ListRoom {\n    listRoom {\n      key\n      name\n      roomType\n      capacity\n      facility\n      building {\n        key\n        name\n      }\n    }\n  }\n": typeof types.ListRoomDocument,
    "\n  mutation CreateRoom($inputs: [RoomInput!]!) {\n    createRoom(inputs: $inputs)\n  }\n": typeof types.CreateRoomDocument,
    "\n  mutation DeleteRoom($key: ID!) {\n    deleteRoom(key: $key)\n  }\n": typeof types.DeleteRoomDocument,
    "\n  mutation UpdateRoom($key: ID!, $replacements: JSON!) {\n    updateRoom(key: $key, replacements: $replacements)\n  }\n": typeof types.UpdateRoomDocument,
    "\n  query ListPerson {\n    listPerson {\n      key\n      personCode\n      name\n      role\n    }\n  }\n": typeof types.ListPersonDocument,
    "\n  mutation CreatePerson($inputs: [PersonInput!]!) {\n    createPerson(inputs: $inputs)\n  }\n": typeof types.CreatePersonDocument,
    "\n  mutation DeletePerson($key: ID!) {\n    deletePerson(key: $key)\n  }\n": typeof types.DeletePersonDocument,
    "\n  mutation UpdatePerson($key: ID!, $replacements: JSON!) {\n    updatePerson(key: $key, replacements: $replacements)\n  }\n": typeof types.UpdatePersonDocument,
    "\n  query ListCourse {\n    listCourse {\n      key\n      courseCode\n      name\n    }\n  }\n": typeof types.ListCourseDocument,
    "\n  mutation CreateCourse($inputs: [CourseInput!]!) {\n    createCourse(inputs: $inputs)\n  }\n": typeof types.CreateCourseDocument,
    "\n  mutation DeleteCourse($key: ID!) {\n    deleteCourse(key: $key)\n  }\n": typeof types.DeleteCourseDocument,
    "\n  mutation UpdateCourse($key: ID!, $replacements: JSON!) {\n    updateCourse(key: $key, replacements: $replacements)\n  }\n": typeof types.UpdateCourseDocument,
    "\n  mutation CreateActivity($inputs: [ActivityInput!]!) {\n    createActivity(inputs: $inputs)\n  }\n": typeof types.CreateActivityDocument,
    "\n  mutation DeleteActivity($key: ID!) {\n    deleteActivity(key: $key)\n  }\n": typeof types.DeleteActivityDocument,
    "\n  mutation UpdateActivity($key: ID!, $replacements: JSON!) {\n    updateActivity(key: $key, replacements: $replacements)\n  }\n": typeof types.UpdateActivityDocument,
    "\n  mutation CreateCourseTeacher($inputs: [CourseTeacherInput!]!) {\n    createCourseTeacher(inputs: $inputs)\n  }\n": typeof types.CreateCourseTeacherDocument,
    "\n  mutation DeleteCourseTeacher($courseKey: ID!, $personKey: ID!) {\n    deleteCourseTeacher(courseKey: $courseKey, personKey: $personKey)\n  }\n": typeof types.DeleteCourseTeacherDocument,
    "\n  mutation UpdateCourseTeacher($courseKey: ID!, $personKey: ID!, $replacements: JSON!) {\n    updateCourseTeacher(courseKey: $courseKey, personKey: $personKey, replacements: $replacements)\n  }\n": typeof types.UpdateCourseTeacherDocument,
    "\n  mutation CreateAllocation($inputs: [AllocationInput!]!) {\n    createAllocation(inputs: $inputs)\n  }\n": typeof types.CreateAllocationDocument,
    "\n  mutation DeleteAllocation($key: ID!) {\n    deleteAllocation(key: $key)\n  }\n": typeof types.DeleteAllocationDocument,
    "\n  mutation UpdateAllocation($key: ID!, $replacements: JSON!) {\n    updateAllocation(key: $key, replacements: $replacements)\n  }\n": typeof types.UpdateAllocationDocument,
    "\n  query ListActivity {\n    listActivity {\n      key\n      name\n      person {\n        key\n        name\n      }\n    }\n  }\n": typeof types.ListActivityDocument,
    "\n  query ListCourseTeacher {\n    listCourseTeacher {\n      personKey\n      courseKey\n      responsibility\n      person {\n        key\n        name\n      }\n      course {\n        key\n        name\n      }\n    }\n  }\n": typeof types.ListCourseTeacherDocument,
    "\n  query ListAllocation {\n    listAllocation {\n      key\n      eventType\n      eventKey\n      startTime\n      endTime\n      room {\n        key\n        name\n        building {\n          key\n          name\n        }\n      }\n    }\n  }\n": typeof types.ListAllocationDocument,
};
const documents: Documents = {
    "\n  query ListCampus {\n    listCampus {\n      key\n      name\n      address\n    }\n  }\n": types.ListCampusDocument,
    "\n  mutation CreateCampus($inputs: [CampusInput!]!) {\n    createCampus(inputs: $inputs)\n  }\n": types.CreateCampusDocument,
    "\n  mutation DeleteCampus($key: ID!) {\n    deleteCampus(key: $key)\n  }\n": types.DeleteCampusDocument,
    "\n  mutation UpdateCampus($key: ID!, $replacements: JSON!) {\n    updateCampus(key: $key, replacements: $replacements)\n  }\n": types.UpdateCampusDocument,
    "\n  query ListBuilding {\n    listBuilding {\n      key\n      name\n      buildingType\n      location\n      campus {\n        key\n        name\n      }\n    }\n  }\n": types.ListBuildingDocument,
    "\n  mutation CreateBuilding($inputs: [BuildingInput!]!) {\n    createBuilding(inputs: $inputs)\n  }\n": types.CreateBuildingDocument,
    "\n  mutation DeleteBuilding($key: ID!) {\n    deleteBuilding(key: $key)\n  }\n": types.DeleteBuildingDocument,
    "\n  mutation UpdateBuilding($key: ID!, $replacements: JSON!) {\n    updateBuilding(key: $key, replacements: $replacements)\n  }\n": types.UpdateBuildingDocument,
    "\n  query ListRoom {\n    listRoom {\n      key\n      name\n      roomType\n      capacity\n      facility\n      building {\n        key\n        name\n      }\n    }\n  }\n": types.ListRoomDocument,
    "\n  mutation CreateRoom($inputs: [RoomInput!]!) {\n    createRoom(inputs: $inputs)\n  }\n": types.CreateRoomDocument,
    "\n  mutation DeleteRoom($key: ID!) {\n    deleteRoom(key: $key)\n  }\n": types.DeleteRoomDocument,
    "\n  mutation UpdateRoom($key: ID!, $replacements: JSON!) {\n    updateRoom(key: $key, replacements: $replacements)\n  }\n": types.UpdateRoomDocument,
    "\n  query ListPerson {\n    listPerson {\n      key\n      personCode\n      name\n      role\n    }\n  }\n": types.ListPersonDocument,
    "\n  mutation CreatePerson($inputs: [PersonInput!]!) {\n    createPerson(inputs: $inputs)\n  }\n": types.CreatePersonDocument,
    "\n  mutation DeletePerson($key: ID!) {\n    deletePerson(key: $key)\n  }\n": types.DeletePersonDocument,
    "\n  mutation UpdatePerson($key: ID!, $replacements: JSON!) {\n    updatePerson(key: $key, replacements: $replacements)\n  }\n": types.UpdatePersonDocument,
    "\n  query ListCourse {\n    listCourse {\n      key\n      courseCode\n      name\n    }\n  }\n": types.ListCourseDocument,
    "\n  mutation CreateCourse($inputs: [CourseInput!]!) {\n    createCourse(inputs: $inputs)\n  }\n": types.CreateCourseDocument,
    "\n  mutation DeleteCourse($key: ID!) {\n    deleteCourse(key: $key)\n  }\n": types.DeleteCourseDocument,
    "\n  mutation UpdateCourse($key: ID!, $replacements: JSON!) {\n    updateCourse(key: $key, replacements: $replacements)\n  }\n": types.UpdateCourseDocument,
    "\n  mutation CreateActivity($inputs: [ActivityInput!]!) {\n    createActivity(inputs: $inputs)\n  }\n": types.CreateActivityDocument,
    "\n  mutation DeleteActivity($key: ID!) {\n    deleteActivity(key: $key)\n  }\n": types.DeleteActivityDocument,
    "\n  mutation UpdateActivity($key: ID!, $replacements: JSON!) {\n    updateActivity(key: $key, replacements: $replacements)\n  }\n": types.UpdateActivityDocument,
    "\n  mutation CreateCourseTeacher($inputs: [CourseTeacherInput!]!) {\n    createCourseTeacher(inputs: $inputs)\n  }\n": types.CreateCourseTeacherDocument,
    "\n  mutation DeleteCourseTeacher($courseKey: ID!, $personKey: ID!) {\n    deleteCourseTeacher(courseKey: $courseKey, personKey: $personKey)\n  }\n": types.DeleteCourseTeacherDocument,
    "\n  mutation UpdateCourseTeacher($courseKey: ID!, $personKey: ID!, $replacements: JSON!) {\n    updateCourseTeacher(courseKey: $courseKey, personKey: $personKey, replacements: $replacements)\n  }\n": types.UpdateCourseTeacherDocument,
    "\n  mutation CreateAllocation($inputs: [AllocationInput!]!) {\n    createAllocation(inputs: $inputs)\n  }\n": types.CreateAllocationDocument,
    "\n  mutation DeleteAllocation($key: ID!) {\n    deleteAllocation(key: $key)\n  }\n": types.DeleteAllocationDocument,
    "\n  mutation UpdateAllocation($key: ID!, $replacements: JSON!) {\n    updateAllocation(key: $key, replacements: $replacements)\n  }\n": types.UpdateAllocationDocument,
    "\n  query ListActivity {\n    listActivity {\n      key\n      name\n      person {\n        key\n        name\n      }\n    }\n  }\n": types.ListActivityDocument,
    "\n  query ListCourseTeacher {\n    listCourseTeacher {\n      personKey\n      courseKey\n      responsibility\n      person {\n        key\n        name\n      }\n      course {\n        key\n        name\n      }\n    }\n  }\n": types.ListCourseTeacherDocument,
    "\n  query ListAllocation {\n    listAllocation {\n      key\n      eventType\n      eventKey\n      startTime\n      endTime\n      room {\n        key\n        name\n        building {\n          key\n          name\n        }\n      }\n    }\n  }\n": types.ListAllocationDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListCampus {\n    listCampus {\n      key\n      name\n      address\n    }\n  }\n"): (typeof documents)["\n  query ListCampus {\n    listCampus {\n      key\n      name\n      address\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCampus($inputs: [CampusInput!]!) {\n    createCampus(inputs: $inputs)\n  }\n"): (typeof documents)["\n  mutation CreateCampus($inputs: [CampusInput!]!) {\n    createCampus(inputs: $inputs)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCampus($key: ID!) {\n    deleteCampus(key: $key)\n  }\n"): (typeof documents)["\n  mutation DeleteCampus($key: ID!) {\n    deleteCampus(key: $key)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCampus($key: ID!, $replacements: JSON!) {\n    updateCampus(key: $key, replacements: $replacements)\n  }\n"): (typeof documents)["\n  mutation UpdateCampus($key: ID!, $replacements: JSON!) {\n    updateCampus(key: $key, replacements: $replacements)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListBuilding {\n    listBuilding {\n      key\n      name\n      buildingType\n      location\n      campus {\n        key\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListBuilding {\n    listBuilding {\n      key\n      name\n      buildingType\n      location\n      campus {\n        key\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateBuilding($inputs: [BuildingInput!]!) {\n    createBuilding(inputs: $inputs)\n  }\n"): (typeof documents)["\n  mutation CreateBuilding($inputs: [BuildingInput!]!) {\n    createBuilding(inputs: $inputs)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteBuilding($key: ID!) {\n    deleteBuilding(key: $key)\n  }\n"): (typeof documents)["\n  mutation DeleteBuilding($key: ID!) {\n    deleteBuilding(key: $key)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateBuilding($key: ID!, $replacements: JSON!) {\n    updateBuilding(key: $key, replacements: $replacements)\n  }\n"): (typeof documents)["\n  mutation UpdateBuilding($key: ID!, $replacements: JSON!) {\n    updateBuilding(key: $key, replacements: $replacements)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListRoom {\n    listRoom {\n      key\n      name\n      roomType\n      capacity\n      facility\n      building {\n        key\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListRoom {\n    listRoom {\n      key\n      name\n      roomType\n      capacity\n      facility\n      building {\n        key\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateRoom($inputs: [RoomInput!]!) {\n    createRoom(inputs: $inputs)\n  }\n"): (typeof documents)["\n  mutation CreateRoom($inputs: [RoomInput!]!) {\n    createRoom(inputs: $inputs)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteRoom($key: ID!) {\n    deleteRoom(key: $key)\n  }\n"): (typeof documents)["\n  mutation DeleteRoom($key: ID!) {\n    deleteRoom(key: $key)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateRoom($key: ID!, $replacements: JSON!) {\n    updateRoom(key: $key, replacements: $replacements)\n  }\n"): (typeof documents)["\n  mutation UpdateRoom($key: ID!, $replacements: JSON!) {\n    updateRoom(key: $key, replacements: $replacements)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListPerson {\n    listPerson {\n      key\n      personCode\n      name\n      role\n    }\n  }\n"): (typeof documents)["\n  query ListPerson {\n    listPerson {\n      key\n      personCode\n      name\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePerson($inputs: [PersonInput!]!) {\n    createPerson(inputs: $inputs)\n  }\n"): (typeof documents)["\n  mutation CreatePerson($inputs: [PersonInput!]!) {\n    createPerson(inputs: $inputs)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePerson($key: ID!) {\n    deletePerson(key: $key)\n  }\n"): (typeof documents)["\n  mutation DeletePerson($key: ID!) {\n    deletePerson(key: $key)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePerson($key: ID!, $replacements: JSON!) {\n    updatePerson(key: $key, replacements: $replacements)\n  }\n"): (typeof documents)["\n  mutation UpdatePerson($key: ID!, $replacements: JSON!) {\n    updatePerson(key: $key, replacements: $replacements)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListCourse {\n    listCourse {\n      key\n      courseCode\n      name\n    }\n  }\n"): (typeof documents)["\n  query ListCourse {\n    listCourse {\n      key\n      courseCode\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCourse($inputs: [CourseInput!]!) {\n    createCourse(inputs: $inputs)\n  }\n"): (typeof documents)["\n  mutation CreateCourse($inputs: [CourseInput!]!) {\n    createCourse(inputs: $inputs)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCourse($key: ID!) {\n    deleteCourse(key: $key)\n  }\n"): (typeof documents)["\n  mutation DeleteCourse($key: ID!) {\n    deleteCourse(key: $key)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCourse($key: ID!, $replacements: JSON!) {\n    updateCourse(key: $key, replacements: $replacements)\n  }\n"): (typeof documents)["\n  mutation UpdateCourse($key: ID!, $replacements: JSON!) {\n    updateCourse(key: $key, replacements: $replacements)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateActivity($inputs: [ActivityInput!]!) {\n    createActivity(inputs: $inputs)\n  }\n"): (typeof documents)["\n  mutation CreateActivity($inputs: [ActivityInput!]!) {\n    createActivity(inputs: $inputs)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteActivity($key: ID!) {\n    deleteActivity(key: $key)\n  }\n"): (typeof documents)["\n  mutation DeleteActivity($key: ID!) {\n    deleteActivity(key: $key)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateActivity($key: ID!, $replacements: JSON!) {\n    updateActivity(key: $key, replacements: $replacements)\n  }\n"): (typeof documents)["\n  mutation UpdateActivity($key: ID!, $replacements: JSON!) {\n    updateActivity(key: $key, replacements: $replacements)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCourseTeacher($inputs: [CourseTeacherInput!]!) {\n    createCourseTeacher(inputs: $inputs)\n  }\n"): (typeof documents)["\n  mutation CreateCourseTeacher($inputs: [CourseTeacherInput!]!) {\n    createCourseTeacher(inputs: $inputs)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCourseTeacher($courseKey: ID!, $personKey: ID!) {\n    deleteCourseTeacher(courseKey: $courseKey, personKey: $personKey)\n  }\n"): (typeof documents)["\n  mutation DeleteCourseTeacher($courseKey: ID!, $personKey: ID!) {\n    deleteCourseTeacher(courseKey: $courseKey, personKey: $personKey)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCourseTeacher($courseKey: ID!, $personKey: ID!, $replacements: JSON!) {\n    updateCourseTeacher(courseKey: $courseKey, personKey: $personKey, replacements: $replacements)\n  }\n"): (typeof documents)["\n  mutation UpdateCourseTeacher($courseKey: ID!, $personKey: ID!, $replacements: JSON!) {\n    updateCourseTeacher(courseKey: $courseKey, personKey: $personKey, replacements: $replacements)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateAllocation($inputs: [AllocationInput!]!) {\n    createAllocation(inputs: $inputs)\n  }\n"): (typeof documents)["\n  mutation CreateAllocation($inputs: [AllocationInput!]!) {\n    createAllocation(inputs: $inputs)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteAllocation($key: ID!) {\n    deleteAllocation(key: $key)\n  }\n"): (typeof documents)["\n  mutation DeleteAllocation($key: ID!) {\n    deleteAllocation(key: $key)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateAllocation($key: ID!, $replacements: JSON!) {\n    updateAllocation(key: $key, replacements: $replacements)\n  }\n"): (typeof documents)["\n  mutation UpdateAllocation($key: ID!, $replacements: JSON!) {\n    updateAllocation(key: $key, replacements: $replacements)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListActivity {\n    listActivity {\n      key\n      name\n      person {\n        key\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListActivity {\n    listActivity {\n      key\n      name\n      person {\n        key\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListCourseTeacher {\n    listCourseTeacher {\n      personKey\n      courseKey\n      responsibility\n      person {\n        key\n        name\n      }\n      course {\n        key\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListCourseTeacher {\n    listCourseTeacher {\n      personKey\n      courseKey\n      responsibility\n      person {\n        key\n        name\n      }\n      course {\n        key\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListAllocation {\n    listAllocation {\n      key\n      eventType\n      eventKey\n      startTime\n      endTime\n      room {\n        key\n        name\n        building {\n          key\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListAllocation {\n    listAllocation {\n      key\n      eventType\n      eventKey\n      startTime\n      endTime\n      room {\n        key\n        name\n        building {\n          key\n          name\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;