from typing import (
    TypeVar,
    Generic,
    Any,
    LiteralString,
    get_origin,
    get_args,
    Literal,
)
from pydantic_core import core_schema

# Bound the TypeVar to str/LiteralString.
# Type checkers will now REJECT Key[UserModel] and only accept string literals.
T = TypeVar("T", bound=str)


class Key(Generic[T], int):
    @property
    def name(self) -> str:
        # Extract the string argument robustly
        if hasattr(self.__class__, "__orig_bases__"):
            for base in getattr(self.__class__, "__orig_bases__"):
                if hasattr(base, "__args__") and base.__args__:
                    arg = base.__args__[0]

                    # 1. Handle direct string literals: Key["user"]
                    if isinstance(arg, str):
                        return f"{arg.lower()}_key"

                    # 2. Handle Literal types: Key[Literal["user"]]
                    # get_origin safely checks if the type is a typing.Literal
                    if get_origin(arg) is Literal:
                        literal_args = get_args(arg)
                        if literal_args and isinstance(literal_args[0], str):
                            return f"{literal_args[0].lower()}_key"

                    # 3. Handle the literal type hint itself: Key[LiteralString]
                    if arg is LiteralString:
                        return "generic_string_key"

        return "key"

    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: Any
    ) -> core_schema.CoreSchema:
        """Enable Pydantic v2 support for Key[T] as an integer type."""
        return core_schema.no_info_after_validator_function(
            cls,
            core_schema.int_schema(),
        )
