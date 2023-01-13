import RecipeBookItem from "./components/RecipeBookItem";
import RecipeBookHeader from "./components/RecipeBookHeader";
import RecipeBookEdit from "./components/RecipeBookEdit";
import { useEffect, useState, useMemo } from "react";
import styles from "./RecipeBooks.module.css";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { fetchRecipeBook, editRecipeBook} from "./api";
import { useRouter } from "next/router";

export default function RecipeBook() {
  const router = useRouter();
  const { idRecipeBook } = router.query;
  const [currentRecipeBook, setCurrentRecipeBook] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const username = "Deyan"; //ESTO SE CAMBIA LUEGO

  useEffect(() => {
    getCurrentRecipeBook();
  }, []);

  const getCurrentRecipeBook = useMemo(() => {
    return () => {
      fetchRecipeBook(idRecipeBook)
        .then((res) => {
          setCurrentRecipeBook(res.data);
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            setCurrentRecipeBook(null);
          } else {
            console.log(err);
            alert("Something went wrong, please try again later.");
          }
        });
    };
  }, []);

  const checkSaveRecipeBook = async (
    newName,
    newSummary,
    currentRecipeBook
  ) => {
    await editRecipeBook(newName, newSummary, currentRecipeBook);

    setShowEdit(false);
    getCurrentRecipeBook();
  };

  

  if (!showEdit)
    return (
      <div>
        <RecipeBookHeader
          data={currentRecipeBook}
          setEdit={setShowEdit}
        ></RecipeBookHeader>
      </div>
    );
  else
    return (
      <RecipeBookEdit
        currentRecipeBook={currentRecipeBook}
        checkSaveRecipeBook={checkSaveRecipeBook}
        setShowCreate={setShowEdit}
        username={username}
      ></RecipeBookEdit>
    );
}
