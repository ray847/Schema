class Priviledge:
    def __init__(self, create: int, read: int, update: int, delete: int):
        self.create = create
        self.read = read
        self.update = update
        self.delete = delete


# user_priviledge = {
#     UserType.ADMIN: Priviledge(1, 1, 1, 1),
#     UserType.STANDARD: Priviledge(0, 1, 0, 0),
#     UserType.ADMIN: Priviledge(0, 0, 0, 0),
# }


PUBLIC_PRIVILEDGE = Priviledge(1, 0, 1, 1)
PRIVATE_PRIVILEDGE = Priviledge(1, 1, 1, 1)
