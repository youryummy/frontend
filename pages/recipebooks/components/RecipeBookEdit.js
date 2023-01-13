import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import {
  validateInput, deleteRecipeBook
} from "../api";
import styles from "../RecipeBooks.module.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function RecipeBookEdit({
  currentRecipeBook,
  setShowCreate,
  checkSaveRecipeBook
}) {
  const [newName, setName] = useState("");
  const [isNew, setIsNew] = useState(true);
  const [newSummary, setSummary] = useState("");
  const [error, setError] = useState({ newSummary: "", newName: "" });

  useEffect(() => {
    if (currentRecipeBook != null) {
      setName(currentRecipeBook.name);
      setSummary(currentRecipeBook.summary);
      setIsNew(false);
    }
  }, []);

  const checkDeleteRecipeBook = async () => {
    await deleteRecipeBook(currentRecipeBook._id);

    history.back()
  };

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
          {!isNew ? (
            <Button
              onClick={() => {
                checkDeleteRecipeBook();
                setShowCreate(false);
              }}
              className={styles.deleteButton}
              variant="contained"
            >
              Delete
            </Button>
          ) : (
            ""
          )}
          <div style={{ width: "100%" }}></div>
          <div style={{ marginRight: "10px" }}>
            <Button
              onClick={() => setShowCreate(false)}
              className={styles.cancelButton}
              variant="contained"
            >
              Cancel
            </Button>
          </div>
          <Button
            onClick={() => {
              checkSaveRecipeBook(newName, newSummary, currentRecipeBook);
            }}
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
