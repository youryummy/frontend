import axios from "axios";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export function fetchData(username) {
  return axios
    .get(`${backendUrl}/api/v1/recipesBooks/findByUserId/${username}`)
    
}

export function fetchRecipeBook(recipeBookId) {

  return axios.get(`${backendUrl}/api/v1/recipesBooks/${recipeBookId}`);
}

export function addRecipeBook(name, summary, username) {
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

export function editRecipeBook(data) {
  return axios
    .put(`${backendUrl}/api/v1/recipesBooks/${data._id}`, {
      name: data.name,
      summary: data.summary,
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


export function deleteRecipeBook(recipeBookId){
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

export function fetchRecipe(recipeId) {
  console.log("fetching recipe", `${backendUrl}/recipes/${recipeId}`);
    return axios.get(`${backendUrl}/api/v1/recipes/${recipeId}`);
}

export const validateInput = (input, type, setState, setError) => {
  setState(input);
};

export const saveRecipeBook = (text) => {};
