import axios from "axios";

const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080"}/api/v1/ingredients`;


export const validateField = (setData, setError, data, field) => {
    switch (field) {
        case "nombre":
            if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
            else setError((prev) => ({...prev, [field]: ""}));
            break;
        case "creado_por":
            if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
            else setError((prev) => ({...prev, [field]: ""}));
            break;
        case "marca":
            if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
            else setError((prev) => ({...prev, [field]: ""}));
            break;
        case "url":
            if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
            else if (!(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/).test(data.url)) setError((prev) => ({...prev, [field]: "Input a valid URL"}));
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

export async function fetchIngredientsData(limit, search, setIngredients) {
    const response = await fetch(`${backendUrl}?limit=${limit}&search=${search}`);
    const data = await response.json();
    setIngredients(data.result);
    return data.result;
}

export async function createIngredient(body) {
    return await axios.post(`${backendUrl}`, {...body, imagen: "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"});
}

export async function updateIngredient(ingredient) {
    return await axios.put(`${backendUrl}${ingredient._id}`, {...ingredient})
}

export async function deleteIngredient(id) {
    return await axios.delete(`${backendUrl}${id}`);
}