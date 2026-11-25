
const USERS_KEY = "cafego_users";
const CURRENT_USER_KEY = "cafego_current_user";

const defaultUsers = [
    {
        id: 1,
        name: "CaféGo Admin",
        email: "admin@cafego.com",
        password: "admin123",
        role: "admin"
    },
    {
        id: 2,
        name: "Coffee Lover",
        email: "customer@cafego.com",
        password: "customer123",
        role: "customer"
    }
];

// Initialize default accounts
export function initializeUsers() {
    const users = localStorage.getItem(USERS_KEY);

    if (!users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }
}

// Get all accounts
export function getUsers() {
    initializeUsers();
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

// Register a new customer
export function registerUser(name, email, password) {
    const users = getUsers();

    const existingUser = users.find(
        user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
        throw new Error("Email is already registered.");
    }

    const newUser = {
        id: Date.now(),
        name,
        email: email.toLowerCase(),
        password,
        role: "customer"
    };

    users.push(newUser);

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    };
}

// Login account
export function loginUser(email, password) {
    const users = getUsers();

    const user = users.find(
        user =>
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
    );

    if (!user) {
        throw new Error("Incorrect email or password.");
    }

    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(safeUser)
    );

    return safeUser;
}

// Get logged-in account
export function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);

    return user ? JSON.parse(user) : null;
}

// Logout
export function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}
