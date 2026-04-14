import pydantic


class Facility(pydantic.BaseModel):
    power_outlet: float
