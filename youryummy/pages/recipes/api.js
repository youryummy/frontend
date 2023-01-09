import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

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
    });
}

const setField = (setData, data, field) => {
    setData((prev) => ({...prev, [field]: data}));
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
}