import RecipeBookItem from "../../components/recipebooks/RecipeBookItem";
import RecipeBookHeader from "../../components/recipebooks/RecipeBookHeader";
import RecipeBookEdit from "../../components/recipebooks/RecipeBookEdit";
import { useEffect, useState } from "react";
import styles from "./RecipeBooks.module.css";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { apiGet, fetchData } from "../../api/recipebooksApi";

export default function RecipeBooks() {
  const [recipebooks, setRecipebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);
  useEffect(() => {
    console.log("Aquiiiiiiiii");
    fetchData("/api/v1/recipesBooks/findByUserId/Sumia", setRecipebooks);
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
        <div className={styles.bookList}>
          {recipebooks.map((item) => (
            <RecipeBookItem
              name={item.name}
              summary={item.summary}
            ></RecipeBookItem>
          ))}
        </div>

        <RecipeBookHeader
          name="Book Name"
          summary="Book description lalaalal"
        ></RecipeBookHeader>
      </div>
    );
  else return <RecipeBookEdit setCreate={setCreate}></RecipeBookEdit>;
}
