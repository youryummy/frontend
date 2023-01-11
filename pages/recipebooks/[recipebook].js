import RecipeBookItem from "../../components/recipebooks/RecipeBookItem";
import RecipeBookHeader from "../../components/recipebooks/RecipeBookHeader";
import RecipeBookEdit from "../../components/recipebooks/RecipeBookEdit";
import { useEffect, useState } from "react";
import styles from "./RecipeBooks.module.css";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { fetchRecipeBook, editRecipeBook} from "./api";
import { useRouter } from "next/router";



export default function RecipeBook() {
    const router = useRouter();
    const { idRecipeBook } = router.query;
  const [recipebook, setRecipebook] = useState({});
  const [loading, setLoading] = useState(true);
  const [ edit, setEdit ] = useState(false);
  const username = "Deyan"; //ESTO SE CAMBIA LUEGO

  useEffect(() => {
    fetchRecipeBook(idRecipeBook, setRecipebook, setLoading);
  }, []);

  if (!edit) return (
    <div>
        <RecipeBookHeader
            name={recipebook.name}
            summary={recipebook.summary}
            setEdit={setEdit}
        ></RecipeBookHeader>
    </div>
  ); 
  else return(
    <RecipeBookEdit data={recipebook} setCreate={setEdit} saveFunction={editRecipeBook} username={username}></RecipeBookEdit>
  );
}
