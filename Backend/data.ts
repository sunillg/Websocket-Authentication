interface User {
    id: string;
    user: string;
    room: string;
}

let users: User[] = [];

const addUser = ({ id, user, room }: { id: string; user: string; room: string }) => {
    user = user.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (!user || !room) {
        return { error: 'Name and room required' };
    }

    const existingUser = users.find((e) => e.user === user && e.room === room);

    if (existingUser) {
        return { error: 'User already exists' };
    }

    const response: User = { id, user, room };
    users.push(response);

    console.log(users);

    return { response };
};

const getUser = (id: string): User | undefined => {
    return users.find((e) => e.id === id);
};

const getRoomUsers = (room: string): User[] => {
    return users.filter((e) => e.room === room);
};

const removeUser = (id: string): User | undefined => {
    const findIdx = users.findIndex((e) => e.id === id);

    if (findIdx >= 0) {
        return users.splice(findIdx, 1)[0];
    }
    return undefined;
};

export {
    addUser,
    getUser,
    removeUser,
    getRoomUsers
};
