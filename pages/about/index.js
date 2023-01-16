import styles from "./About.module.css";
import Plans from "../../components/Plans";
import Typography from "@mui/material/Typography";

export default function About() {
  return (
    <>
      <div className={styles.container}>
        <Typography
          className={styles.title}
          sx={{ fontWeight: "600", color: "gray" }}
          variant="h4"
        >
          About us
        </Typography>
        <span className={styles.hero}>
          YourYummy! es una red social de gastronomía donde los usuarios pueden
          compartir sus recetas y valorar las de otros usuarios. Además, los
          usuarios pueden crear sus propios planes de comidas y guardar sus
          recetas favoritas en libros de recetas.
        </span>
        <Plans></Plans>
        <Typography sx={{ fontWeight: "600", color: "gray" }} variant="h5">
          Contact us
        </Typography>
        <Typography sx={{ fontWeight: "400", color: "gray" }} variant="h6">
          youryummy2022@gmail.com
        </Typography>
      </div>
    </>
  );
}
