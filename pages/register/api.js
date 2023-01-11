import axios from "axios";
import { login } from "../login/api.js";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export const setField = (setData, data, field) => {
    setData((prev) => ({...prev, [field]: data && field === "avatar" ? {url: URL.createObjectURL(data), file: data} : data}));
}

export const validateField = (setData, setError, data, field) => {
    switch (field) {
        case "username":
            if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
            else setError((prev) => ({...prev, [field]: ""}));
            break;
        case "password":
            if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
            else if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*-_])(?=.{8,})/).test(data)) setError((prev) => ({...prev, [field]: "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number"}));
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

export const register = (data, setError) => {
    let avatarFile;
    if (data.username === "") return setError((prev) => ({...prev, username: "Cannot be empty"}));
    if (data.password === "") return setError((prev) => ({...prev, password: "Cannot be empty"}));
    if (data.fullName === "") return setError((prev) => ({...prev, fullName: "Cannot be empty"}));
    if (data.email === "") return setError((prev) => ({...prev, email: "Cannot be empty"}));
    if (data.birthDate === "") delete data.birthDate;
    if (data.cellPhone === "") delete data.cellPhone;
    if (data.avatar) avatarFile = data.avatar.file;
    delete data.avatar;

    const formData = new FormData();
    formData.append("Avatar", avatarFile ?? "");
    formData.append("AccountInfo", JSON.stringify(data));

    axios.post(`${backendUrl}/api/v1/register`, formData, 
    {   withCredentials: true,
        headers: { "content-type": "multipart/form-data"}
    }).then(() => {
        login(data.username, data.password);
    }).catch((err) => {
        alert(err.response?.data.message ?? err.response?.data.error ?? "Could not connect to server, please try again later");
    });
}