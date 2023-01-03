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
        case "username":
            if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
            else setError((prev) => ({...prev, [field]: ""}));
            break;
        case "password":
            if (data.length > 0 && !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*-_])(?=.{8,})/).test(data)) setError((prev) => ({...prev, [field]: "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number"}));
            else setError((prev) => ({...prev, [field]: ""}));
            break;
        case "fullName":
            if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
            else setError((prev) => ({...prev, [field]: ""}));
            break;
        case "email":
            if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
            else if (!(/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/).test(data)) setError((prev) => ({...prev, [field]: "Invalid email address"}));
            else setError((prev) => ({...prev, [field]: ""}));
            break;
        case "birthDate":
            if (isNaN(new Date(data).getTime()) || new Date(data) > new Date()) setError((prev) => ({...prev, [field]: "Invalid birth date. Must input a valid Date prior to the current date."}));
            else setError((prev) => ({...prev, [field]: ""}));
            break;
        case "cellPhone":
            if (data.length > 0 && !(/^[+]?[(]?[0-9]{0,3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im).test(data)) setError((prev) => ({...prev, [field]: "Invalid phone number"}));
            else setError((prev) => ({...prev, [field]: ""}));
            break;
    }
    setField(setData, data, field);
}

export const modify = (username, data, setError, setEdit) => {
    let avatarFile;
    if (data.username === "") return setError((prev) => ({...prev, username: "Cannot be empty"}));
    if (data.fullName === "") return setError((prev) => ({...prev, fullName: "Cannot be empty"}));
    if (data.email === "") return setError((prev) => ({...prev, email: "Cannot be empty"}));
    if (data.birthDate === "") delete data.birthDate;
    if (data.cellPhone === "") delete data.cellPhone;
    if (data.avatar) avatarFile = data.avatar.file;
    delete data.avatar;

    const formData = new FormData();
    formData.append("Avatar", avatarFile ?? "");
    formData.append("AccountInfo", JSON.stringify(data));

    return axios.put(`${backendUrl}/api/v1/accounts/${username}`, formData, 
    {   withCredentials: true,
        headers: { "content-type": "multipart/form-data"}
    }).then(async () => {
        if (avatarFile) await delay(1500); // wait to avoid 403 error
        setEdit(false);
    }).catch((err) => {
        if (err.response?.status === 400) alert(err.response.data.message);
        else alert(err.response?.data.message ?? err.response?.data.error ?? "Could not connect to server, please try again later");
    });
}