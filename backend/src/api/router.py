import strawberry
import strawberry.fastapi
import core


def get_context() -> core.execute.ExecutionContext:
    return core.execute.ExecutionContext()


graphql_router = strawberry.fastapi.GraphQLRouter(
    strawberry.Schema(query=core.execute.Query,
                      mutation=core.execute.Mutation),
    context_getter=get_context,
)
