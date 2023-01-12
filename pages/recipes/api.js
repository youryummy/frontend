import axios from "axios";

const backendUrl = "http://localhost:8080/api/v1/";
// const backendUrl = "youryummy-gateway-youryummy-maribelrb22.cloud.okteto.net/api/v1/");

async function apiGet(endpoint) {
    return await axios.get(`${backendUrl}${endpoint}`, { withCredentials: true });
}

async function apiPut(endpoint, body) {
    return await axios.put(`${backendUrl}${endpoint}`, body, {
        withCredentials: true,
    });
}

async function apiPost(endpoint, body) {
    return await axios.post(`${backendUrl}${endpoint}`, body, {
        withCredentials: true,
    });
}

async function apiDelete(endpoint) {
    return await axios.delete(`${backendUrl}${endpoint}`, {
        withCredentials: true,
    });
}


export async function editRecipe(recipeId, timestamp, synced) {
    const endpoint = "events";
    const body = {
        id: eventId,
        timestamp: timestamp,
        synced: synced,
    };
    return await apiPut(endpoint, body);
}


export async function getRecipes() {
    const endpoint = "recipes";
    let response = await apiGet(endpoint);
    return response;
}

export async function deleteRecipe(recipeId) {
    const endpoint = `recipes/${recipeId}`;
    return await apiDelete(endpoint);
}

export async function getRecipe(recipeId) {
    const endpoint = `recipes/${recipeId}`;
    return await apiGet(endpoint);
}