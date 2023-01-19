import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import styles from "./Comments.module.css";
import Comment from "./Comment";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { fetchData, putEditComment, deleteRating, putLike, validateInput, postRating } from "../../api/ratingsApi";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function CommentsList(props) {
  const { idRecipe, username } = props;
  const [ratings, setRatings] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [like, setLike] = useState(false);
  const [currentUserRating, setCurrentUserRating] = useState({});
  const [showEditComment, setShowEditComment] = useState(false);
  const [error, setError] = useState({ newComment: "" });
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    getCurrentRatings();
  }, []);

  const getCurrentRatings = useMemo(() => {
    return () => {
      setCurrentUserRating({});
      setCommentText("");
      fetchData(idRecipe)
        .then((res) => {
          res.data.forEach((item) => {
            if (item.idUser === username) {
              setCurrentUserRating(item);
              setCommentText(item.comment);
            }
          });
          setRatings(res.data.reverse());
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            setRatings(null);
            
          } else {
            console.log(err);
            alert("Something went wrong, please try again later.");
          }
        });
    };
  }, []);

  const checkDeleteComment = async() => {
    if (!currentUserRating.like) {
      await deleteRating(currentUserRating._id);
    } else {
      await putEditComment("", currentUserRating);
    }
    setShowEditComment(false);
    getCurrentRatings();
  }

  const checkLikeComment = async(like) => {
    await putLike(like, currentUserRating);
    getCurrentRatings();
  }

  const checkPostComment = async(
    currentUserRating,
    like,
    commentText,
    username,
    idRecipe
  ) => {
    if (JSON.stringify(currentUserRating) === "{}") {
      await postRating(like, commentText, username, idRecipe).catch((err) => alert(err.response?.status === 429 ? "You exceeded the quota for this resource" : "Something went wrong, please try again later."));
    } else {
      await putEditComment(commentText, currentUserRating);
    }
    setShowEditComment(false);
    getCurrentRatings();
  }

  return (
    <>
      <Item
        elevation={6}
        style={{
          borderRadius: "30px",
          height: "auto",
          padding: "20px",
          margin: "20px",
          width: "100%"
        }}
      >
        <h1>Comments</h1>
        {currentUserRating.comment === "" ||
        JSON.stringify(currentUserRating) === "{}" ||
        showEditComment ? (
          <div>
            <TextField
              value={commentText}
              onChange={(ev) =>
                validateInput(
                  ev.target.value,
                  "newComment",
                  setCommentText,
                  setError
                )
              }
              helperText={error.newComment}
              className={styles.formInput}
              multiline
              rows={4}
              label="Add Comment"
              variant="outlined"
            />

            <div className={styles.postButtonContainer}>
              {showEditComment ? (
                <div
                  style={{
                    marginRight: "10px",
                    display: "flex",
                    width: "100%",
                  }}
                >
                  <Button
                    onClick={() => checkDeleteComment(currentUserRating)}
                    className={styles.deleteButton}
                    variant="contained"
                  >
                    Delete
                  </Button>
                  <div style={{ width: "100%" }}></div>
                  <Button
                    onClick={() => setShowEditComment(false)}
                    className={styles.cancelButton}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                ""
              )}
              <Button
                onClick={() =>{
                  setLoadingButton(true);
                  checkPostComment(
                    currentUserRating,
                    like,
                    commentText,
                    username,
                    idRecipe
                  ).finally(() => setLoadingButton(false))
                }}
                className={styles.postButton}
                variant="contained"
                disabled={loadingButton}
              >
                {loadingButton ? <CircularProgress size={24} color="inherit" /> : "Post"}
              </Button>
            </div>
          </div>
        ) : (
          ""
        )}
        {ratings.map((item, index) => (
          <Comment
            key={index}
            data={item}
            putLike={checkLikeComment}
            idUser={username}
            setShowEditComment={setShowEditComment}
          >
            {" "}
          </Comment>
        ))}
      </Item>
    </>
  );
}
