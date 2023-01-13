import Grid from "@mui/material/Grid";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import styles from "./Comments.module.css";
import Comment from "./Comment";
import { TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { validateInput, postComment } from "./api";
import { putEditComment } from "./api";


export default function EditComment({showEditComment, currentUserRating, commentText, setCommentText}) {
  const [error, setError] = useState({ newComment: "" });
  return (
    <>
        {currentUserRating == null || showEditComment ? (
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

    </>
  );
}
