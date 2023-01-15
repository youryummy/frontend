import axios from "axios";

const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080"}/api/v1/`;

// RecipeId view functions
export function fetchRecipes(path, setData, setLoading,) {
    axios.get(`${backendUrl}${path}`, {withCredentials: true}).then((res) => {
        setData(res.data);
        setLoading(false);
    }).catch((err) => {
        setData(null);
        setLoading(false);
        if (err.response?.status > 499) {
            console.log(err);
            alert("Something went wrong, please try again later.");    
        }
    });
}

export function fetchData(path) {
    return axios.get(`${backendUrl}${path}`, {withCredentials: true});
}

export function addToPlanner(recipeId, date) {
    return axios.post(`${backendUrl}events`, {id: recipeId, timestamp: date}, {withCredentials: true});
}

export const validateField = (setData, setError, data, field) => {
    switch (field) {
        case "name":
            if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
            else setError((prev) => ({...prev, [field]: ""}));
            break;
        case "duration":
            if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
            else if (parseInt(data) < 0) setError((prev) => ({...prev, [field]: "Duration must be greater than zero"}));
            else {
                setError((prev) => ({...prev, [field]: ""}));
                data = parseInt(data);
            }
            break;
        case "summary":
            if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
            else setError((prev) => ({...prev, [field]: ""}));
            break;
    }
    setData((prev) => ({...prev, [field]: data}));
};


// Index View functions
function apiGet(endpoint) {
    return axios.get(`${backendUrl}${endpoint}`, { withCredentials: true });
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


export function editRecipe(recipeId, data) {
    const endpoint = `recipes/${recipeId}`;
    return apiPut(endpoint, data);
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

export function getRecommendations(username, plan) {
    const endpoint = `recommendation/${username}/${plan}`;
    return apiGet(endpoint);
}

export async function getRecommendedRecipes(ids) {
    const endpoint = `recipes/recommendation`;
    return await apiPost(endpoint, ids);
}