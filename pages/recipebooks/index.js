import RecipeBookItem from "../../components/recipebooks/RecipeBookItem";
import RecipeBookHeader from "../../components/recipebooks/RecipeBookHeader";
import RecipeBookEdit from "../../components/recipebooks/RecipeBookEdit";

import styles from "./RecipeBooks.module.css";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';

export default function RecipeBooks() {
  return (
  
  <div>
    <IconButton aria-label="delete" size="large" color="default" style={{ margin: "25px" }}>
         <AddIcon fontSize="inherit"/>
    </IconButton>
    <div className={styles.bookList}>

    
    <RecipeBookItem name="Book Name" summary="Book description lalaalal"></RecipeBookItem>
    <RecipeBookItem name="Book Name" summary="Book description lalaalal"></RecipeBookItem>
    <RecipeBookItem name="Book Name" summary="Book description lalaalal"></RecipeBookItem>
    <RecipeBookItem name="Book Name" summary="Book description lalaalal"></RecipeBookItem>
    <RecipeBookItem name="Book Name" summary="Book description lalaalal"></RecipeBookItem>


    </div>

    <RecipeBookHeader name="Book Name" summary="Book description lalaalal"></RecipeBookHeader>
    <RecipeBookEdit></RecipeBookEdit>
  </div>
  
  
  
  
  
  
  
  );
}
