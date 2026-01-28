const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
    const headers = { "Content-Type": "application/json", };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
    }

    return data;
}