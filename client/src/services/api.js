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

export const fetchBehaviorClassification = async (token) => {
    const response = await fetch(`${BASE_URL}/behavior/classification`, {
        method: "GET",
        headers: {
            Authorization: `${token}`
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Behavior classification fetch failed");
    }

    return data;
};

export const fetchBehaviorAlerts = async (token) => {
    const response = await fetch(`${BASE_URL}/behavior/alerts`, {
        method: "GET",
        headers: {
            Authorization: `${token}`
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Behavior alerts fetch failed");
    }

    return data;
};

export const fetchBehaviorScores = async (token) => {
    const response = await fetch(`${BASE_URL}/behavior/scores`, {
        method: "GET",
        headers: {
            Authorization: `${token}`
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Behavior scores fetch failed");
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

export const fetchStudentAttendance = async (studentId, token) => {
    const response = await fetch(`${BASE_URL}/attendance/student/${studentId}`, {
        method: "GET",
        headers: {
            Authorization: `${token}`
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Student attendance fetch failed");
    }

    return data;
};

export const enrollStudentFace = async (studentId, imageFile, token) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`${BASE_URL}/students/${studentId}/enroll-face`, {
        method: "POST",
        headers: {
            Authorization: `${token}`
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Face enrollment failed");
    }

    return data;
};

export const recognizeFaceAndMarkAttendance = async ({ imageFile, date, status = "Present" }, token) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("date", date);
    formData.append("status", status);

    const response = await fetch(`${BASE_URL}/attendance/recognize-face`, {
        method: "POST",
        headers: {
            Authorization: `${token}`
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Face recognition failed");
    }

    return data;
};
