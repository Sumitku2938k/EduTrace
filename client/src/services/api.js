// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
// const TOKEN_KEY = "edutrace_token";
// const USER_KEY = "edutrace_user";
const BASE_URL = "http://localhost:5000/api";

// class ApiError extends Error {
//   constructor(message, status) {
//     super(message);
//     this.name = "ApiError";
//     this.status = status;
//   }
// }

// export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

// export const getStoredUser = () => {
//   const rawUser = localStorage.getItem(USER_KEY);

//   if (!rawUser) {
//     return null;
//   }

//   try {
//     return JSON.parse(rawUser);
//   } catch {
//     localStorage.removeItem(USER_KEY);
//     return null;
//   }
// };

// export const setAuthSession = ({ token, user }) => {
//   if (token) {
//     localStorage.setItem(TOKEN_KEY, token);
//   }

//   if (user) {
//     localStorage.setItem(USER_KEY, JSON.stringify(user));
//   }
// };

// export const clearAuthSession = () => {
//   localStorage.removeItem(TOKEN_KEY);
//   localStorage.removeItem(USER_KEY);
// };

// const toBearerToken = (token) => {
//   if (!token) {
//     return "";
//   }

//   return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
// };

// const createAuthHeaders = (token) => {
//   const authToken = token || getStoredToken();

//   if (!authToken) {
//     return {};
//   }

//   return {
//     Authorization: toBearerToken(authToken),
//   };
// };

// const request = async (endpoint, options = {}) => {
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
//   const isJson = response.headers.get("content-type")?.includes("application/json");
//   const data = isJson ? await response.json() : null;

//   if (!response.ok) {
//     if (response.status === 401) {
//       clearAuthSession();
//     }

//     const message = data?.message || data?.msg || "Request failed";
//     throw new ApiError(message, response.status);
//   }

//   return data;
// };

// export const registerUser = async (user) => {
//   return request("/auth/register", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(user),
//   });
// };
export const registerUser = async (user) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if (!res.ok) {
        throw new Error("Registration failed");
    }

    return res.json();
};

// export const loginUser = async (credentials) => {
//   const data = await request("/auth/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(credentials),
//   });

//   setAuthSession(data);
//   return data;
// };
export const loginUser = async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    return data;
};
// export const fetchCurrentUser = async (token) => {
//   const data = await request("/auth/user", {
//     method: "GET",
//     headers: {
//       ...createAuthHeaders(token),
//     },
//   });

//   return data.user;
// };

// export const fetchStudents = async (token) => {
//   const data = await request("/students", {
//     method: "GET",
//     headers: {
//       ...createAuthHeaders(token),
//     },
//   });

//   return data.students;
// };
export const fetchStudents= async (token) => {
    const response = await fetch(`${BASE_URL}/students`, {
        method: "GET",
        headers: {
            Authorization: `${token}`,
        },
    });
    return response.json();
};

// export const getStudentById = async (id, token) => {
//   const data = await request(`/students/${id}`, {
//     method: "GET",
//     headers: {
//       ...createAuthHeaders(token),
//     },
//   });

//   return data.student;
// };

export const getStudentById = async (id, token) => {
    const response = await fetch(`${BASE_URL}/students/${id}`, {
        method: "GET",
        headers: {
            Authorization: `${token}`
        },
    });

    if (!response.ok) {
        throw new Error("Student fetch failed");
    }

    return response.json();
};

// export const createStudent = async (payload, token) => {
//   return request("/students/create", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...createAuthHeaders(token),
//     },
//     body: JSON.stringify(payload),
//   });
// };

export const createStudent = async (formData, token) => {
    const res = await fetch(`${BASE_URL}/students`, {
        method: "POST",
        headers: {
            Authorization: `${token}`
        },
        body: formData
    });

    if (!res.ok) {
        throw new Error("Student creation failed");
    }

    return res.json();
};

// export const updateStudent = async (id, payload, token) => {
//   return request(`/students/update/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       ...createAuthHeaders(token),
//     },
//     body: JSON.stringify(payload),
//   });
// };

export const updateStudent = async (id, formData, token) => {
    const res = await fetch(`${BASE_URL}/students/${id}`, {
        method: "PATCH",  
        headers: {
            Authorization: `${token}`
        },
        body: formData
    });

    if (!res.ok) {
        throw new Error("Student update failed");
    }

    return res.json();
};
// export const deleteStudentById = async (id, token) => {
//   return request(`/students/delete/${id}`, {
//     method: "DELETE",
//     headers: {
//       ...createAuthHeaders(token),
//     },
//   });
// };
export const deleteStudentById = async (id, token) => {
    const response = await fetch(`${BASE_URL}/students/delete/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `${token}`
        },
    });

    if (!response.ok) {
        throw new Error("Student deletion failed");
    }

    return response.json();
};
