import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));


export default function RecipeBookHeader({name, summary}) {

  return (
    <>
      <Item style={{ borderRadius: "20px", width: "100%", height: "auto", padding: "20px", margin: "20px" }}>
        <h1>{name}</h1>
        <p>{summary}</p>
      </Item>
    </>
  );
}
