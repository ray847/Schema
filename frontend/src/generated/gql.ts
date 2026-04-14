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
    "\n  query ListBuilding {\n    listBuilding {\n      key\n      name\n      buildingType\n      location\n      campus {\n        name\n      }\n    }\n  }\n": typeof types.ListBuildingDocument,
    "\n  query ListRoom {\n    listRoom {\n      key\n      name\n      roomType\n      capacity\n      facility\n      building {\n        name\n      }\n    }\n  }\n": typeof types.ListRoomDocument,
    "\n  query ListPerson {\n    listPerson {\n      key\n      personCode\n      name\n      role\n    }\n  }\n": typeof types.ListPersonDocument,
    "\n  query ListCourse {\n    listCourse {\n      key\n      courseCode\n      name\n    }\n  }\n": typeof types.ListCourseDocument,
    "\n  query ListActivity {\n    listActivity {\n      key\n      name\n      person {\n        name\n      }\n    }\n  }\n": typeof types.ListActivityDocument,
    "\n  query ListCourseTeacher {\n    listCourseTeacher {\n      personKey\n      courseKey\n      responsibility\n      person {\n        name\n      }\n      course {\n        name\n      }\n    }\n  }\n": typeof types.ListCourseTeacherDocument,
    "\n  query ListAllocation {\n    listAllocation {\n      key\n      eventType\n      eventKey\n      startTime\n      endTime\n      room {\n        name\n        building {\n          name\n        }\n      }\n    }\n  }\n": typeof types.ListAllocationDocument,
};
const documents: Documents = {
    "\n  query ListCampus {\n    listCampus {\n      key\n      name\n      address\n    }\n  }\n": types.ListCampusDocument,
    "\n  query ListBuilding {\n    listBuilding {\n      key\n      name\n      buildingType\n      location\n      campus {\n        name\n      }\n    }\n  }\n": types.ListBuildingDocument,
    "\n  query ListRoom {\n    listRoom {\n      key\n      name\n      roomType\n      capacity\n      facility\n      building {\n        name\n      }\n    }\n  }\n": types.ListRoomDocument,
    "\n  query ListPerson {\n    listPerson {\n      key\n      personCode\n      name\n      role\n    }\n  }\n": types.ListPersonDocument,
    "\n  query ListCourse {\n    listCourse {\n      key\n      courseCode\n      name\n    }\n  }\n": types.ListCourseDocument,
    "\n  query ListActivity {\n    listActivity {\n      key\n      name\n      person {\n        name\n      }\n    }\n  }\n": types.ListActivityDocument,
    "\n  query ListCourseTeacher {\n    listCourseTeacher {\n      personKey\n      courseKey\n      responsibility\n      person {\n        name\n      }\n      course {\n        name\n      }\n    }\n  }\n": types.ListCourseTeacherDocument,
    "\n  query ListAllocation {\n    listAllocation {\n      key\n      eventType\n      eventKey\n      startTime\n      endTime\n      room {\n        name\n        building {\n          name\n        }\n      }\n    }\n  }\n": types.ListAllocationDocument,
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
export function graphql(source: "\n  query ListBuilding {\n    listBuilding {\n      key\n      name\n      buildingType\n      location\n      campus {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListBuilding {\n    listBuilding {\n      key\n      name\n      buildingType\n      location\n      campus {\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListRoom {\n    listRoom {\n      key\n      name\n      roomType\n      capacity\n      facility\n      building {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListRoom {\n    listRoom {\n      key\n      name\n      roomType\n      capacity\n      facility\n      building {\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListPerson {\n    listPerson {\n      key\n      personCode\n      name\n      role\n    }\n  }\n"): (typeof documents)["\n  query ListPerson {\n    listPerson {\n      key\n      personCode\n      name\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListCourse {\n    listCourse {\n      key\n      courseCode\n      name\n    }\n  }\n"): (typeof documents)["\n  query ListCourse {\n    listCourse {\n      key\n      courseCode\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListActivity {\n    listActivity {\n      key\n      name\n      person {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListActivity {\n    listActivity {\n      key\n      name\n      person {\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListCourseTeacher {\n    listCourseTeacher {\n      personKey\n      courseKey\n      responsibility\n      person {\n        name\n      }\n      course {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListCourseTeacher {\n    listCourseTeacher {\n      personKey\n      courseKey\n      responsibility\n      person {\n        name\n      }\n      course {\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListAllocation {\n    listAllocation {\n      key\n      eventType\n      eventKey\n      startTime\n      endTime\n      room {\n        name\n        building {\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListAllocation {\n    listAllocation {\n      key\n      eventType\n      eventKey\n      startTime\n      endTime\n      room {\n        name\n        building {\n          name\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;