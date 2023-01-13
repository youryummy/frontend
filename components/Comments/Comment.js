import styles from "./Comments.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { putRating } from "./api";

export default function Comment({ data, name, img, idUser, setShowEditComment}) {
  return (
    <>
      <div className={styles.comment}>
        <div className={styles.pfpContainer}>
          <img src={img} className={styles.commentPfp} />
        </div>
        <div>
          <div className={styles.commentLine}>
            <p className={styles.commentName}>{name}</p>

            {idUser === data.idUser ? (
              <div className={styles.commentLine}>
                {data.like ? (
                  <IconButton onClick={() => putRating(false, data.comment, data)}  aria-label="like" size="small" color="default">
                    <FavoriteIcon fontSize="inherit"/>
                  </IconButton>
                ) : (
                  <IconButton onClick={() => putRating(true, data.comment, data)} aria-label="like" size="small" color="default">
                    <FavoriteBorderIcon  fontSize="inherit"/>
                  </IconButton>
                )}
                 <IconButton  onClick={() => setShowEditComment(true)} aria-label="edit"  size="small" color="default">
                  <EditIcon fontSize="inherit"/>
                </IconButton>

              </div>
            ) : (
              <div className={styles.commentLine}>
                {data.like ? (
                  <IconButton   aria-label="like" disabled  size="small"  color="default">
                    <FavoriteIcon fontSize="inherit" />
                  </IconButton>
                ) : (
                  <IconButton   aria-label="like" disabled  size="small" color="default">
                    <FavoriteBorderIcon fontSize="inherit" />
                  </IconButton>
                )}
              </div>
            )}
          </div>

          <p className={styles.commentText}>{data.comment}</p>
        </div>
      </div>
    </>
  );
}
