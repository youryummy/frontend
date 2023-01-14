import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import IconButton from "@mui/material/IconButton";
import styles from "../RecipeBooks.module.css";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { fetchData } from "../api";
import { editRecipeBook } from "../api";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
}));

export default function AddToRecipeBookModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [recipebooks, setRecipebooks] = useState([]);
  const username = useSelector((state) => state.token?.username);
  const currentRecipeId = "nuevoid"; //TODO pasar id de receta

  const checkAddToRecipeBook = async (
    chosenRecipeBook
  ) => {
    chosenRecipeBook["recipeList"].push(currentRecipeId);
    await editRecipeBook(chosenRecipeBook);

    handleClose();
  };
  
  useEffect(() => {
    getCurrentRecipeBooks();
  }, []);

  const getCurrentRecipeBooks = useMemo(() => {
    return () => {
      fetchData(username)
        .then((res) => {
          setRecipebooks(res.data);
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            setRecipebooks(null);
          } else {
            console.log(err);
            alert("Something went wrong, please try again later.");
          }
        });
    };
  }, []);
  
  return (
    <div style={{alignSelf: "center"}}>
        <IconButton  onClick={handleOpen} aria-label="addToRecipeBook" size="small" color="default">
            <BookmarkBorderIcon fontSize="inherit" />
        </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Item style={{ borderRadius: "20px", height: "auto", padding: "20px" }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Choose a recipe book
          </Typography>
          {recipebooks.map((item, index) => (
            <div className={styles.recipeBookOptionContainer} onClick={() => checkAddToRecipeBook(item)}>
                <p className={styles.recipeBookOption}>{item.name}</p>
    
           
            </div> ))}
            <div className={styles.cancelAddToRBButton}>
          <Button onClick={handleClose} className={styles.cancelButton} variant="contained">Cancel</Button>
          </div>
        
          
        </Item>
      </Modal>
    </div>
  );
}


