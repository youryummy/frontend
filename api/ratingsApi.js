import axios from "axios";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export const validateInput = (input, type, setState, setError) => {
  setState(input);
};

export function fetchData(idRecipe) {
  return axios.get(`${backendUrl}/api/v1/ratings/findByRecipeId/${idRecipe}`, {withCredentials: true});
}

export function postRating(like, comment, username, idRecipe) {
  return axios.post(`${backendUrl}/api/v1/ratings`, {
    idUser: username,
    idRecipe: idRecipe,
    like: like,
    comment: comment,
  }, {withCredentials: true});
}

export function putLike(like, data) {
  return axios.put(`${backendUrl}/api/v1/ratings/${data._id}`, {
    like: like,
    comment: data.comment,
    idUser: data.idUser,
    idRecipe: data.idRecipe,
  }, {withCredentials: true});
}

export function putEditComment(comment, data) {
  return axios.put(`${backendUrl}/api/v1/ratings/${data._id}`, {
    like: data.like,
    comment: comment,
    idUser: data.idUser,
    idRecipe: data.idRecipe,
  }, {withCredentials: true});
}

export function deleteRating(idRating) {
  return axios
    .delete(`${backendUrl}/api/v1/ratings/${idRating}`, {withCredentials: true})
    .then(function (response) {
      console.log(response);
    });
}
