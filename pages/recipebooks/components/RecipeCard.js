import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import styles from "../RecipeBooks.module.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function RecipeBookItem({img, name, summary}) {

  return (
    <>
      <Item style={{ borderRadius: "20px", width: "250px", height: "auto", padding: "0px", paddingBottom:"20px", margin: "20px", userSelect: "none", cursor: "pointer" }}>
        <img className={styles.recipeImg} src={img} alt="test" />
        <h1>{name}</h1>
        <p>{summary}</p>
      </Item>
    </>
  );
}
