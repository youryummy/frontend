import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { TextField, Button } from "@mui/material";
import { useState } from "react";
import { validateInput, saveRecipeBook } from "../../pages/recipebooks/api";
import styles from "../../pages/recipebooks/RecipeBooks.module.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function RecipeBookEdit({ name, summary, setCreate }) {
  const [newName, setName] = useState("");
  const [newSummary, setSummary] = useState("");
  const [error, setError] = useState({ newSummary: "", newName: "" });
  return (
    <>
      <Item
        style={{
          borderRadius: "20px",
          width: "90%",
          height: "auto",
          padding: "30px",
          margin: "20px",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <TextField
            value={newName}
            onChange={(ev) =>
              validateInput(ev.target.value, "newName", setName, setError)
            }
            helperText={error.newName}
            className={styles.formInput}
            label="Name"
            variant="outlined"
          />
        </div>
        <TextField
          value={newSummary}
          onChange={(ev) =>
            validateInput(ev.target.value, "newSummary", setSummary, setError)
          }
          helperText={error.newSummary}
          className={styles.formInput}
          multiline
          rows={4}
          label="Description"
          variant="outlined"
        />
        <div className={styles.saveButtonContainer}>
          <div style={{ marginRight: "10px" }}>
            <Button
              onClick={() => setCreate(false)}
              className={styles.cancelButton}
              variant="contained"
            >
              Cancel
            </Button>
          </div>
          <Button
            onClick={() => postComment(newComment)}
            className={styles.saveButton}
            variant="contained"
          >
            Save
          </Button>
        </div>
      </Item>
    </>
  );
}
