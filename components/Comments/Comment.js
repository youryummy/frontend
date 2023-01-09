import styles from "./Comments.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

export default function Comment({ name, like, text, img, byUser }) {
  return (
    <>
      <div className={styles.comment}>
        <div className={styles.pfpContainer}>
          <img src={img} className={styles.commentPfp} />
        </div>
        <div>
          <div className={styles.commentLine}>
            <p className={styles.commentName}>{name}</p>

            {byUser ? (
              <div className={styles.commentLine}>
                {like ? (
                  <IconButton aria-label="like" size="small" color="default">
                    <FavoriteIcon fontSize="inherit"/>
                  </IconButton>
                ) : (
                  <IconButton aria-label="like" size="small" color="default">
                    <FavoriteBorderIcon  fontSize="inherit"/>
                  </IconButton>
                )}
                 <IconButton aria-label="edit"  size="small" color="default">
                  <EditIcon fontSize="inherit"/>
                </IconButton>
                <IconButton aria-label="delete"  size="small" color="default">
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </div>
            ) : (
              <div className={styles.commentLine}>
                {like ? (
                  <IconButton aria-label="like" disabled  size="small"  color="default">
                    <FavoriteIcon fontSize="inherit" />
                  </IconButton>
                ) : (
                  <IconButton aria-label="like" disabled  size="small" color="default">
                    <FavoriteBorderIcon fontSize="inherit" />
                  </IconButton>
                )}
              </div>
            )}
          </div>

          <p className={styles.commentText}>{text}</p>
        </div>
      </div>
    </>
  );
}
