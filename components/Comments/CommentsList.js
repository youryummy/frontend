import Grid from "@mui/material/Grid";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import styles from "./Comments.module.css";
import Comment from "./Comment";
import { TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { validateInput, postRating } from "./api";
import { fetchData, putEditComment, deleteRating } from "./api";
import {_} from "lodash";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export function checkComment(username, setShowAddComment, comments) {}

export default function CommentsList() {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [like, setLike] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddComment, setShowAddComment] = useState(true);
  const [currentUserRating, setCurrentUserRating] = useState({});
  const [showEditComment, setShowEditComment] = useState(false);
  const [error, setError] = useState({ newComment: "" });
  const idRecipe = "jfkdlfdsfdsjsakalks"; //TODO
  const username = "Deyan"; //TODO

  useEffect(() => {
    fetchData(
      idRecipe,
      setComments,
      setLoading,
      setCurrentUserRating,
      username,
      setCommentText
    );
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
        {currentUserRating.comment === "" || JSON.stringify(currentUserRating) === '{}' || showEditComment ? (
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
            <div style={{ marginRight: "10px", display: "flex", width: "100%" }}>
            <Button
                onClick={() => deleteRating(currentUserRating._id)}
                className={styles.deleteButton}
                variant="contained"
              >
                Delete
              </Button>
              <div style={{width: "100%"}}></div>
            <Button
                onClick={() => setShowEditComment(false)}
                className={styles.cancelButton}
                variant="contained"
              >
                Cancel
              </Button>
              </div>) : ""}
              <Button
                onClick={() =>
                  showEditComment
                    ? putEditComment(commentText, currentUserRating)
                    : postRating(like, commentText, username, idRecipe)
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
        {comments.map((item, index) => (
          <Comment
            key={index}
            name="TODO"
            data={item}
            idUser={username}
            setShowEditComment={setShowEditComment}
            img="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          >
            {" "}
          </Comment>
        ))}
      </Item>
    </>
  );
}
