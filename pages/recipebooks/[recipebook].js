import RecipeCard from "./components/RecipeCard";
import RecipeBookHeader from "./components/RecipeBookHeader";
import RecipeBookEdit from "./components/RecipeBookEdit";
import { useEffect, useState, useMemo } from "react";
import styles from "./RecipeBooks.module.css";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { fetchRecipeBook, editRecipeBook } from "./api";
import { useRouter } from "next/router";
import Link from "next/Link";

export default function RecipeBook() {
  const router = useRouter();
  const { idRecipeBook } = router.query;
  const [currentRecipeBook, setCurrentRecipeBook] = useState({});
  const [recipeList, setRecipeList] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const username = "Deyan"; //ESTO SE CAMBIA LUEGO

  useEffect(() => {
    getCurrentRecipeBook();
  }, []);

  const getCurrentRecipeBook = useMemo(() => {
    return () => {
      fetchRecipeBook(idRecipeBook)
        .then((res) => {
          console.log(res.data);
          setCurrentRecipeBook(res.data);
          setRecipeList(res.data["recipeList"]);
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
    currentRecipeBook["name"] = newName;
    currentRecipeBook["summary"] = newSummary;
    await editRecipeBook(currentRecipeBook);

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
        
       

        <div className={styles.bookList}>
          
        {recipeList.map((item, index) => (
              <Link
                key={index}
                href={{
                  pathname: "/recipebooks/[recipebook]",
                  query: { idRecipeBook: item },
                }}
              >
                <RecipeCard
            img="https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2018/12/Shakshuka-19.jpg"
            name="Receta"
            summary="ñam que rico"
          ></RecipeCard>
              </Link>
            ))}
        </div>
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
