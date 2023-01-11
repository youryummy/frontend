import Grid from "@mui/material/Grid";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import styles from "./Comments.module.css";
import Comment from "./Comment";
import { TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { validateInput, postComment } from "./api";
import { fetchData, postRating } from "./api";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export function checkComment(username, setShowAddComment, comments) {
  comments.forEach((item) => {
    if (item.idUser === username) {
      setShowAddComment(false);
    }
  });
}

export default function CommentsList() {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [like, setLike] = useState(false);
  const [showAddComment, setShowAddComment] = useState(true);
  const [error, setError] = useState({ newComment: "" });
  const idRecipe = "jfkdlfdsfdsjsakalks"; //TODO
  const username = "Deyan"; //TODO

  useEffect(() => {
    fetchData(idRecipe, setComments)
    checkComment(username, setShowAddComment, comments);
  }, []);

  return (
    <>
      <Item
        style={{
          borderRadius: "20px",
          height: "auto",
          padding: "20px",
          margin: "20px",
        }}
      >
        <h1>Comments</h1>
        {showAddComment ? (
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
              <Button
                onClick={() =>
                  postRating(like, commentText, username, idRecipe)
                }
                className={styles.postButton}
                variant="contained"
              >
                Post
              </Button>
            </div>
          </div>
        ) : (
          ""
        )}
        {comments.map((item) => (
          <Comment
            name="TODO"
            data={item}
            idUser={username}
            img="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          >
            {" "}
          </Comment>
        ))}
      </Item>
    </>
  );
}
