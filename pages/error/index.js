import styles from "./Error.module.css";
import Typography from "@mui/material/Typography";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

export default function Error() {
  return (
    <div className={styles.container}>
      <div className={styles.centeredContainer}>
        <SentimentDissatisfiedIcon className={styles.notFoundError} />
        <Typography
          className={styles.title}
          sx={{ fontWeight: "600", color: "gray" }}
          variant="h5"
        >
          Hey! Stop there!
        </Typography>
        <Typography
          className={styles.subtitle}
          sx={{ fontWeight: "600", color: "gray" }}
          variant="h6"
        >
          Something went wrong and you are not allowed to continue
        </Typography>
      </div>
    </div>
  );
}
