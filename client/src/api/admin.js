import API from "./axios";

// Users
export const getAllUsers = () => API.get("/user/admin/users");
export const registerNewAdmin = (data) => API.post("/user/admin/create", data);

// Books
export const getAllBooks = () => API.get("/book/all");
export const addBook = (data) => API.post("/book/admin/add", data);

// Borrows
export const getAllBorrows = () => API.get("/borrow/admin");
