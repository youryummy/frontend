import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function RecipeBookHeader({ name, summary }) {
  return (
    <>
      <Item
        style={{
          borderRadius: "20px",
          width: "90%",
          height: "auto",
          padding: "20px",
          margin: "20px",
        }}
      >
        <div style={{display: "flex", justifyContent: "center"}}>
          <h1 style={{marginRight: "5px"}}>{name}</h1>
          <IconButton aria-label="edit" size="small" color="default">
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton aria-label="delete" size="small" color="default">
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </div>

        <p>{summary}</p>
      </Item>
    </>
  );
}
