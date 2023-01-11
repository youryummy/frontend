import RecipeBookItem from "../../components/recipebooks/RecipeBookItem";
import RecipeBookHeader from "../../components/recipebooks/RecipeBookHeader";
import RecipeBookEdit from "../../components/recipebooks/RecipeBookEdit";
import { useEffect, useState } from "react";
import styles from "./RecipeBooks.module.css";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { fetchData, addRecipeBook } from "./api";
import Link from "next/Link";

export default function RecipeBooks() {
  const [recipebooks, setRecipebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);
  const username = "Deyan"; //ESTO SE CAMBIA LUEGO

  useEffect(() => {
    fetchData(username, setRecipebooks, setLoading);
  }, []);

  if (!create)
    return (
      <div>
        <IconButton
          onClick={() => setCreate(true)}
          aria-label="delete"
          size="large"
          color="default"
          style={{ margin: "25px" }}
        >
          <AddIcon fontSize="inherit" />
        </IconButton>

        {recipebooks.length === 0 ? (
          <div>no hay</div>
        ) : (
          <div className={styles.bookList}>
            {recipebooks.map((item) => (
              <Link
                href={{
                  pathname: "/recipebooks/[recipebook]",
                  query: { idRecipeBook: item._id },
                }}
              >
                <RecipeBookItem
                  name={item.name}
                  summary={item.summary}
                ></RecipeBookItem>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  else
    return (
      <RecipeBookEdit
        setCreate={setCreate}
        saveFunction={addRecipeBook}
        username={username}
      ></RecipeBookEdit>
    );
}
