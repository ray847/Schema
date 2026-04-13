import shared
import backend

# print(shared.sql_schema)
view = (
    backend.db.View(shared.TableSet.BUILDING)
    .filter("building_type = school")
    .select(("name",))
)
print(view.sql)
