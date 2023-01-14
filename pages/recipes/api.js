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
    console.log(`${backendUrl}${endpoint}`)
    return await axios.post(`${backendUrl}${endpoint}`, body, {
        withCredentials: true,
    });
}

async function apiDelete(endpoint) {
    return await axios.delete(`${backendUrl}${endpoint}`, {
        withCredentials: true,
    });
}


export async function editRecipe(recipeId, data) {
    const endpoint = `recipes/${recipeId}`;
    console.log(endpoint)
    console.log(data)
    return await apiPut(endpoint, data);
}

export async function postRecipe(data) {
    const endpoint = "recipes";
    
    return await apiPost(endpoint, data);
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

export async function getRecommendations(username, plan) {
    const endpoint = `recommendation/${username}/${plan}`;
    return await apiGet(endpoint);
}

export async function getRecommendedRecipes(ids) {
    const endpoint = `recipes/recommendation`;
    return await apiPost(endpoint, ids);
}