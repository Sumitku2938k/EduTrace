const BASE_URL = "http://localhost:5000/api";

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

export const fetchStudents= async (token) => {
    const response = await fetch(`${BASE_URL}/students`, {
        method: "GET",
        headers: {
            Authorization: `${token}`,
        },
    });
    return response.json();
};

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
