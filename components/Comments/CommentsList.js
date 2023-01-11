import Grid from "@mui/material/Grid";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import styles from "./Comments.module.css";
import Comment from "./Comment";
import { TextField, Button } from "@mui/material";
import { useState } from "react";
import { validateInput, postComment} from "./api";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));


export default function CommentsList() {
  const [newComment, setComment] = useState("");
  const [error, setError] = useState({newComment: ""});

  return (
    <>
      <Item style={{ borderRadius: "20px", height: "auto", padding: "20px", margin: "20px" }}>
        <h1>Comments</h1>
        <TextField value={newComment} onChange={(ev) => validateInput(ev.target.value, "newComment", setComment, setError)}  helperText={error.newComment} className={styles.formInput} multiline rows={4} label="Add Comment" variant="outlined" />
        <div className={styles.postButtonContainer}>
        <Button onClick={() => postComment(newComment)} className={styles.postButton} variant="contained">Post</Button>

        </div>
        <Comment name="Deyan" like={true} text="texto prueba" img="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" byUser={true} > </Comment>
        <Comment name="Deyan" like={false} text="texto prueba" img="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" byUser={false} > </Comment>

      </Item>
    </>
  );
}
