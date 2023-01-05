import Grid from "@mui/material/Grid";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import styles from "./Comments.module.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Comments() {
  return (
    <>
      <Item style={{ borderRadius: "20px", height: "350px" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        ></div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <img src="/empytPfp.png" className={styles.commentPfp} />

          <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <p className={styles.commentName}>Nombre</p>
            <img
              src="/heartIconFill.svg"
              style={{
                width: "15px",
                height: "15px",
                marginTop: "auto",
                marginBottom: "auto",
                marginLeft: "5px",
              }}
            />
          </div>
        

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          ultrices dapibus purus, vitae hendrerit elit rhoncus non. Etiam
          maximus purus non diam bibendum, at iaculis est feugiat.
        </p>
        <p>test p3</p>
        </div>
        </div>
      </Item>
    </>
  );
}
