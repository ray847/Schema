# TODO

* ~~Add table editing.~~
* Implement simplified access control.
  * User schema/model
    * Add a `User` SQLite table through `TableRegistry`.
    * Store `key`, `person_key`, `email`, `password_hash`, and `type`.
    * Keep `person_key` nullable, unique when present, and linked to `Person(key)`.
    * Link a user to a person later after the account is registered and logged in.
    * Keep `email` unique and non-null.
    * Never expose `password_hash` in public API responses.
  * Password hashing and JWT
    * Use `pwdlib[argon2]` for password hashing.
    * Use `pyjwt` bearer tokens for authenticated requests.
    * Configure `SECRET_KEY`, `ALGORITHM`, and `ACCESS_TOKEN_EXPIRE_MINUTES`.
  * First-user admin bootstrap
    * If the `User` table is empty, the first registered user becomes `admin`.
    * All later registered users default to `standard`.
    * Ignore any client attempt to choose `admin` during registration.
  * REST auth endpoints
    * `POST /auth/register`: create a user and return only public user fields.
    * `POST /auth/token`: log in with email/password and return a bearer token.
    * `GET /auth/me`: return the current token owner's public user fields.
  * GraphQL integration
    * Parse optional bearer tokens into GraphQL `current_user` context.
    * Keep normal table list queries public.
    * Require `admin` for normal table create/update/delete mutations.
    * Do not add a full-table `list_user` query.
  * Private table rule
    * `User` is self-only through the JWT user key, including for admins.
    * Future `Preference` table should follow the same self-only rule.
    * Preference table is not implemented yet.
  * Verification checklist
    * Confirm first registration creates an `admin`.
    * Confirm second and later registrations create `standard` users.
    * Confirm passwords are stored only as Argon2 hashes.
    * Confirm duplicate email fails.
    * Confirm multiple unlinked users can have `person_key = NULL`.
    * Confirm login succeeds with the correct password and fails otherwise.
    * Confirm `/auth/me` never returns `password_hash`.
    * Confirm public GraphQL list queries still work.
    * Confirm GraphQL mutations fail for unauthenticated, `standard`, and `spectate` users.
    * Confirm GraphQL mutations succeed for `admin`.
