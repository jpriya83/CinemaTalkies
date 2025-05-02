// utils/users.js

const users = [];

// Join user to chat
export function userjoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

// Get current user
export function getcurrentuser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
export function userleave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get all users in a room
export function getroomuser(room) {
    return users.filter(user => user.room === room);
}
