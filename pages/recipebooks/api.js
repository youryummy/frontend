import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export async function apiGet(endpoint) {
    return await axios.get(`${backendUrl}${endpoint}`);
}

export function fetchData(path, setData) {
    axios.get(`${backendUrl}${path}`).then((res) => {
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


export const validateInput = (input, type, setState, setError) => {
   
    setState(input);
}

export const saveRecipeBook = (text) => {
    
}