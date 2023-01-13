import RecipeBookItem from "./components/RecipeBookItem";
import RecipeBookHeader from "./components/RecipeBookHeader";
import RecipeBookEdit from "./components/RecipeBookEdit";
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
                key="{item}"
                href={{
                  pathname: "/recipebooks/[recipebook]",
                  query: { idRecipeBook: item._id },
                }}
              >
                <RecipeBookItem data={item}></RecipeBookItem>
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
        username={username}
      ></RecipeBookEdit>
    );
}
