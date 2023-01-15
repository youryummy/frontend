import RecipeBookItem from "./components/RecipeBookItem";
import RecipeBookEdit from "./components/RecipeBookEdit";
import { useEffect, useState, useMemo } from "react";
import styles from "./RecipeBooks.module.css";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { fetchData, addRecipeBook } from "./api";
import Link from "next/Link";
import { useSelector } from "react-redux";

export default function RecipeBooks() {
  const [recipebooks, setRecipebooks] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const username = useSelector((state) => state.token?.username);

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

  const checkSaveRecipeBook = async (
    newName,
    newSummary,
    currentRecipeBook
  ) => {
    await addRecipeBook(newName, newSummary, username);

    setShowCreate(false);
    getCurrentRecipeBooks();
  };

  if (!showCreate)
    return (
      <div style={{padding: "10px 30px"}}>
        <IconButton
          onClick={() => setShowCreate(true)}
          aria-label="delete"
          size="large"
          color="default"
        >
          <AddIcon fontSize="inherit" />
        </IconButton>       

        {recipebooks.length === 0 ? (
          ""
        ) : (
          <div className={styles.bookList}>
            {recipebooks.map((item, index) => (
              <Link
                key={index}
                href={{
                  pathname: `/recipebooks/${item._id}`
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
        checkSaveRecipeBook={checkSaveRecipeBook}
        setShowCreate={setShowCreate}
        username={username}
      ></RecipeBookEdit>
    );
}
