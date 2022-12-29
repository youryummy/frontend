import axios from "axios";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

export const validateInput = (input, type, setState, setError) => {
    if (input === "") {
        setError((prev) => ({...prev, [type]: "Cannot be empty"}));
    } else {
        setError({username: "", password: ""});
    }
    setState(input);
}

export const login = (username, password, setError) => {
    if (username === "") return setError((prev) => ({...prev, username: "Cannot be empty"}));
    if (password === "") return setError((prev) => ({...prev, password: "Cannot be empty"}));
    
    axios.post(`${backendUrl}/api/v1/login`, {username, password}, {withCredentials: true}).then(() => {
        window.location.href = "/";
    }).catch((err) => {
        alert(err.response?.data.message ?? "Could not connect to server, please try again later");
    });
}