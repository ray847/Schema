from fastapi import Request
import strawberry
import strawberry.fastapi
import core
import core.auth as auth_service


def get_context(request: Request) -> core.execute.ExecutionContext:
    current_user = auth_service.user_from_authorization_header(
        request.headers.get("Authorization")
    )
    return core.execute.ExecutionContext(current_user=current_user)


graphql_router = strawberry.fastapi.GraphQLRouter(
    strawberry.Schema(query=core.execute.Query,
                      mutation=core.execute.Mutation),
    context_getter=get_context,
)
