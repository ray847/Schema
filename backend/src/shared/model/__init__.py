from .campus import CampusCreate, CampusResponse, CampusModel, CampusInput
from .building import (
    BuildingCreate,
    BuildingResponse,
    BuildingModel,
    BuildingInput,
)
from .room import RoomCreate, RoomResponse, RoomModel, RoomInput
from .person import PersonCreate, PersonResponse, PersonModel, PersonInput
from .course import CourseCreate, CourseResponse, CourseModel, CourseInput
from .activity import ActivityCreate, ActivityResponse, ActivityModel, ActivityInput
from .course_teacher import (
    CourseTeacherCreate,
    CourseTeacherResponse,
    CourseTeacherModel,
    CourseTeacherInput,
)
from .allocation import (
    AllocationCreate,
    AllocationResponse,
    AllocationModel,
    AllocationInput,
    EventType,
)
from .facility import Facility

__all__ = [
    "CampusCreate",
    "CampusResponse",
    "CampusModel",
    "CampusInput",
    "BuildingCreate",
    "BuildingResponse",
    "BuildingModel",
    "BuildingInput",
    "RoomCreate",
    "RoomResponse",
    "RoomModel",
    "RoomInput",
    "PersonCreate",
    "PersonResponse",
    "PersonModel",
    "PersonInput",
    "CourseCreate",
    "CourseResponse",
    "CourseModel",
    "CourseInput",
    "ActivityCreate",
    "ActivityResponse",
    "ActivityModel",
    "ActivityInput",
    "CourseTeacherCreate",
    "CourseTeacherResponse",
    "CourseTeacherModel",
    "CourseTeacherInput",
    "AllocationCreate",
    "AllocationResponse",
    "AllocationModel",
    "AllocationInput",
    "EventType",
    "Facility",
]
