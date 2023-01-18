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


// CRUD functions
export function fetchRecommendedRecipes(username, plan, setRecipes, setLoading) {
    fetchData(`recipes?username=${username}&plan=${plan}`)
        .then((res) => { setRecipes(res.data); setLoading(false) })
        .catch((err) => {
            setRecipes(null);
            setLoading(false);
            if (err.response?.status !== 404) {
                alert("Something went wrong, please try again later.");
            }
        });
}

export function fetchData(path) {
    return axios.get(`${backendUrl}${path}`, {withCredentials: true});
}

export function postRecipe(data, username, setError) {
    if ((data.name ?? "").length === 0) return setError((prev) => ({...prev, name: "Cannot be empty"}));
    if ((data.duration ?? "").length === 0) return setError((prev) => ({...prev, duration: "Cannot be empty"}));
    if (parseInt(data?.duration) < 0) return setError((prev) => ({...prev, duration: "Duration must be greater than zero"}));
    if ((data.summary ?? "").length === 0) return setError((prev) => ({...prev, summary: "Cannot be empty"}));
    
    console.log("Data: ", data)
    // TODO Save image
    return axios.post(`${backendUrl}recipes`, {...data, createdBy: username}, {withCredentials: true});
}

export function editRecipe(recipeId, data) {
    console.log("Data: ", data);
    return axios.put(`${backendUrl}recipes/${recipeId}`, data, {
        withCredentials: true,
    });
}

export function deleteRecipe(recipeId) {
    return axios.delete(`${backendUrl}recipes/${recipeId}`, {withCredentials: true});
}
