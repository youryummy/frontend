import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const backendUrl = "http://localhost:8080/api/v1/";
// const backendUrl = "youryummy-gateway-youryummy-maribelrb22.cloud.okteto.net/api/v1/");

export function fetchData(path, setData, setLoading,) {
    axios.get(`${backendUrl}${path}`, {withCredentials: true}).then((res) => {
        setData(res.data);
        setLoading(false);
    }).catch((err) => {
        if (err.response?.status === 404) {
            setData(null);
            setLoading(false);
        } else {
            console.log(err);
            alert("Something went wrong, please try again later.");
        }
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

        const setField = (setData, data, field) => {
            setData((prev) => ({...prev, [field]: data}));
            async function apiDelete(endpoint) {
                return await axios.delete(`${backendUrl}${endpoint}`, {
                    withCredentials: true,
                });
            }

            export const validateField = (setData, setError, data, field) => {
                switch (field) {
                    case "name":
                        if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
                        else setError((prev) => ({...prev, [field]: ""}));
                        break;
                    case "duration":
                        if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
                        else setError((prev) => ({...prev, [field]: ""}));
                        break;
                    case "summary":
                        if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
                        else setError((prev) => ({...prev, [field]: ""}));
                        break;

                }
                setField(setData, data, field);
                export async function editRecipe(recipeId, timestamp, synced) {
                    const endpoint = "events";
                    const body = {
                        id: eventId,
                        timestamp: timestamp,
                        synced: synced,
                    };
                    return await apiPut(endpoint, body);
                }

                export const modify = (idRecipe, data, setError, setEdit) => {
                    let recipeFile;
                    if (data.name === "") return setError((prev) => ({...prev, name: "Cannot be empty"}));
                    if (data.duration === "") return setError((prev) => ({...prev, duration: "Cannot be empty"}));
                    if (data.summary === "") delete data.summary;
                    if (data.steps === "") delete data.steps;
                    if (data.tags === "") delete data.tags;
                    if (data.photo) recipeFile = data.photo.file;
                    delete data.photo;

                    const formData = new FormData();
                    formData.append("Avatar", avatarFile ?? "");
                    export async function getRecipes() {
                        const endpoint = "recipes";
                        let response = await apiGet(endpoint);
                        return response;
                    }

                    return axios.put(`${backendUrl}/api/v1/recipes/${idRecipe}`, formData,
                        {   withCredentials: true,
                            headers: { "content-type": "multipart/form-data"}
                        }).then(async () => {
                        if (recipeFile) await delay(1500); // wait to avoid 403 error
                        setEdit(false);
                    }).catch((err) => {
                        if (err.response?.status === 400) alert(err.response.data.message);
                        else alert(err.response?.data.message ?? err.response?.data.error ?? "Could not connect to server, please try again later");
                    });
                    export async function deleteRecipe(recipeId) {
                        const endpoint = `recipes/${recipeId}`;
                        return await apiDelete(endpoint);
                    }

                    export async function getRecipe(recipeId) {
                        const endpoint = `recipes/${recipeId}`;
                        return await apiGet(endpoint);
                    }
                }