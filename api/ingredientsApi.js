import axios from "axios";

const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080"}/api/v1/ingredients/`;


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
    try {
        const response = await fetch(`${backendUrl}?limit=${limit}&search=${search}`, {withCredentials: true})
        const data = await response.json();
        setIngredients(data.result);
        return data.result;
    } catch (err) {
        if (err.response?.status === 403) alert("You can't modify an ingredient that you didn't create.");
        else alert("Something went wrong, please try again later.");
        return [];
    }
}

export async function createIngredient(body, setIngredients, setIsIngredientBeingCreated, setOpen, setIngredientBeingEdited, username) {
    await axios.post(`${backendUrl}`, {...body, creado_por: username, imagen: "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"}, {withCredentials: true})
    .then((response) => {
        setIngredients((prev) => prev.concat(response.data))
        setIsIngredientBeingCreated(false)
        setOpen(false);
        setIngredientBeingEdited({});
    })
    .catch((err) => {
        if (err.response?.status === 403) alert("You can't modify an ingredient that you didn't create.");
        else alert("Something went wrong, please try again later.");
    });
}

export async function updateIngredient(ingredient, setIngredients, setOpen, setIngredientBeingEdited) {
    await axios.put(`${backendUrl}${ingredient._id}`, {...ingredient}, {withCredentials: true})
    .then(() => {
        setIngredients((prev) => prev.map((i) => i._id === ingredient._id ? ingredient : i));
        setOpen(false);
        setIngredientBeingEdited({});
    })
    .catch((err) => {
        if (err.response?.status === 403) alert("You can't modify an ingredient that you didn't create.");
        else alert("Something went wrong, please try again later.");
    });

}

export async function deleteIngredient(id, setIngredients) {
    await axios.delete(`${backendUrl}${id}`, {withCredentials: true})
    .then(() => setIngredients((prev) => prev.filter((i) => i._id !== id)))
    .catch((err) => {
        if (err.response?.status === 403) alert("You can't modify an ingredient that you didn't create.");
        else alert("Something went wrong, please try again later.");
    });
}