import RecipeBookItem from "./components/RecipeBookItem";
import RecipeBookHeader from "./components/RecipeBookHeader";
import RecipeBookEdit from "./components/RecipeBookEdit";
import { useEffect, useState } from "react";
import styles from "./RecipeBooks.module.css";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { fetchRecipeBook, editRecipeBook } from "./api";
import { useRouter } from "next/router";

export default function RecipeBook() {
  const router = useRouter();
  const { idRecipeBook } = router.query;
  const [recipebook, setRecipebook] = useState({});
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const username = "Deyan"; //ESTO SE CAMBIA LUEGO

  useEffect(() => {
    fetchRecipeBook(idRecipeBook, setRecipebook, setLoading);
  }, []);

  if (!edit)
    return (
      <div>
        <RecipeBookHeader
          data={recipebook}
          idRecipeBook={idRecipeBook}
          setEdit={setEdit}
        ></RecipeBookHeader>
      </div>
    );
  else
    return (
      <RecipeBookEdit
        data={recipebook}
        setCreate={setEdit}
        username={username}
      ></RecipeBookEdit>
    );
}
