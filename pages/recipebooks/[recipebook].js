import RecipeCard from "./components/RecipeCard";
import RecipeBookHeader from "./components/RecipeBookHeader";
import RecipeBookEdit from "./components/RecipeBookEdit";
import { useEffect, useState, useMemo } from "react";
import styles from "./RecipeBooks.module.css";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { fetchRecipeBook, editRecipeBook, fetchRecipe } from "../../api/recipebooksApi";
import { useRouter } from "next/router";
import Link from "next/Link";
import { useSelector } from "react-redux";

export default function RecipeBook() {
  const router = useRouter();
  const { recipebook: idRecipeBook } = router.query;
  const [currentRecipeBook, setCurrentRecipeBook] = useState({});
  const [recipeList, setRecipeList] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const username = useSelector((state) => state.token?.username);

  useEffect(() => {
    getCurrentRecipeBook();
  }, []);

  const getCurrentRecipeBook = useMemo(() => {
    return () => {
      fetchRecipeBook(idRecipeBook)
        .then((res) => {
          console.log(res.data);
          let newRecipeList = [];
          const prom = res.data["recipeList"].map((item, index) => {
            return fetchRecipe(item)
              .then((recipeRes) => {
                newRecipeList.push(recipeRes.data);
                console.log("RECETA:", recipeRes.data);
              })
              .catch((err) => {
                console.log(err);
                alert("Something went wrong, please try again later.");
              });
          });

          Promise.all(prom).then(() => {
            setRecipeList(newRecipeList);
            setCurrentRecipeBook(res.data);
          });
          
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
      <div style={{ padding: "10px 30px" }}>
        <RecipeBookHeader
          data={currentRecipeBook}
          setEdit={setShowEdit}
        ></RecipeBookHeader>

        <div
          className={styles.bookList}
          style={{ justifyContent: "flex-start" }}
        >
          {recipeList.map((item, index) => (
            <Link
            key={index}
            href={{
              pathname: `/recipes/${item._id}`
            }}
          >
            <RecipeCard
                img={item.imageUrl}
                name={item.name}
                summary={item.summary}
                idRecipeBook={item._id}
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
