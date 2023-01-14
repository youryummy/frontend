import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function RecipeBookHeader({ data, setEdit}) {
  return (
    <>
    <div style={{display: "flex", justifyContent: "center"}}>
      <Item
        style={{
          borderRadius: "20px",
          width: "100%",
          height: "auto",
          padding: "20px",
          margin: "20px",
        }}
      >
        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
          <h1 style={{marginRight: "5px"}}>{data.name}</h1>
          <IconButton onClick={() => setEdit(true) } aria-label="edit" size="medium" color="default">
            <EditIcon fontSize="inherit" />
          </IconButton>
        </div>

        <p>{data.summary}</p>
      </Item>
      </div>
    </>
  );
}
