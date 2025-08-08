const API_DOMAIN = "https://microservices.appf4.io.vn/adamstore/v1/admin/";

export const get = async (path) => {
    const token = localStorage.getItem("token");
    const response = await fetch(API_DOMAIN + path, {
        headers: { Authorization: `Bearer ${token}`, }
    });
    const result = await response.json();
    return result;
}

export const post = async (path, option) => {
    const token = localStorage.getItem("token");
    const response = await fetch(API_DOMAIN + path, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(option)
    });
    const result = await response.json();
    return result;
}

export const put = async (path, id, option) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_DOMAIN}${path}/${id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(option)
    });
    const result = await response.json();
    return result;
}

export const del = async (path, id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_DOMAIN}${path}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, }
    });
    const result = await response.json();
    return result;
}

export const restore = async (path, id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_DOMAIN}${path}/${id}/restore`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, }
    });
    const result = await response.json();
    return result;
}