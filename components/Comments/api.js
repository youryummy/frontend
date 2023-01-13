import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export const validateInput = (input, type, setState, setError) => {
   
    setState(input);
}



export function fetchData(idRecipe, setData, setLoading, setCurrentUserRating, username, setCommentText) {
    
    axios.get(`${backendUrl}/api/v1/ratings/findByRecipeId/${idRecipe}`).then((res) => {
      res.data.forEach((item) => {
        if (item.idUser === username) {
          setCurrentUserRating(item);
          setCommentText(item.comment);
        }
        });
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

export const postRating = (like, comment, username, idRecipe) => {

    return axios.post(`${backendUrl}/api/v1/ratings`, {
        idUser: username,
        idRecipe: idRecipe,
        like: like,
        comment: comment
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}

export const putRating = (like, comment, data) => {

    return axios.put(`${backendUrl}/api/v1/ratings/${data._id}`, {
        like: like,
        comment: comment,
        idUser: data.idUser,
        idRecipe: data.idRecipe
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}

export const putEditComment = (comment, data) => {

  return axios.put(`${backendUrl}/api/v1/ratings/${data._id}`, {
      like: data.like,
      comment: comment,
      idUser: data.idUser,
      idRecipe: data.idRecipe
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}




export const deleteRating = (idRating) => {
    return axios.delete(`${backendUrl}/api/v1/ratings/${idRating}`)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}
