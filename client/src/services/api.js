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
    const response = await fetch(`${BASE_URL}/students/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Student creation failed");
    }

    return data;
};

export const updateStudent = async (id, formData, token) => {
    const response = await fetch(`${BASE_URL}/students/update/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Student update failed");
    }

    return data;
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

export const fetchAttendanceByDate = async (date, token) => {
    const response = await fetch(`${BASE_URL}/attendance?date=${date}`, {
        method: "GET",
        headers: {
            Authorization: `${token}`
        },
    });

    const data = await response.json();

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(data.message || "Attendance fetch failed");
    }

    return data.attendance || null;
};

export const saveAttendance = async (payload, token) => {
    const response = await fetch(`${BASE_URL}/attendance`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Attendance save failed");
    }

    return data;
};

export const fetchDashboardSummary = async (token) => {
    const response = await fetch(`${BASE_URL}/attendance/summary`, {
        method: "GET",
        headers: {
            Authorization: `${token}`
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Dashboard summary fetch failed");
    }

    return data;
};

export const fetchStudentAttendancePercentages = async (token) => {
    const response = await fetch(`${BASE_URL}/attendance/student-percentages`, {
        method: "GET",
        headers: {
            Authorization: `${token}`
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Student attendance percentage fetch failed");
    }

    return data;
};
