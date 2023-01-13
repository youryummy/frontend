import axios from "axios";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export function fetchData(username, setData, setLoading) {
  axios
    .get(`${backendUrl}/api/v1/recipesBooks/findByUserId/${username}`)
    .then((res) => {
      setData(res.data);
      setLoading(false);
    })
    .catch((err) => {
      if (err.response?.status === 404) {
        setData(null);
        setLoading(false);
      } else {
        console.log(err);
        alert("Something went wrong, please try again later.");
      }
    });
}

export function fetchRecipeBook(recipeBookId, setData, setLoading) {
  console.log("fetch aqui "+`${backendUrl}/api/v1/recipesBooks/`+recipeBookId)

  axios.get(`${backendUrl}/api/v1/recipesBooks/${recipeBookId}`)
    .then((res) => {
      setData(res.data);
      setLoading(false);
    })
    .catch((err) => {
      if (err.response?.status === 404) {
        setData(null);
        setLoading(false);
      } else {
        console.log(err);
        alert("Something went wrong, please try again later.");
      }
    });
}

export const addRecipeBook = (name, summary, username) => {
  return axios.post(`${backendUrl}/api/v1/recipesBooks`, {
      name: name,
      summary: summary,
      recipeList: [],
      idUser: username,
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const editRecipeBook = (name, summary, data) => {
  return axios
    .put(`${backendUrl}/api/v1/recipesBooks/${data._id}`, {
      name: name,
      summary: summary,
      recipeList: data.recipeList,
      idUser: data.idUser,
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const deleteRecipeBook = (recipeBookId) =>{
    console.log("borro aqui "+`${backendUrl}/api/v1/recipesBooks/`+recipeBookId)
    return axios
      .delete(`${backendUrl}/api/v1/recipesBooks/${recipeBookId}`)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

export const validateInput = (input, type, setState, setError) => {
  setState(input);
};

export const saveRecipeBook = (text) => {};
