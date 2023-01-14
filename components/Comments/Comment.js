import styles from "./Comments.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";


export default function Comment({ data, idUser, setShowEditComment, putLike}) {
  return (
    <>
      <div className={styles.comment}>
        <div className={styles.pfpContainer}>
          <img src={data.hasOwnProperty('avatar') ? data.avatar  :"https://ionicframework.com/docs/img/demos/avatar.svg"} className={styles.commentPfp} />
        </div>
        <div>
          <div className={styles.commentLine}>
            <p className={styles.commentName}>{data.hasOwnProperty('fullName') ? data.fullName  :"SinNombre"}</p>

            {idUser === data.idUser ? (
              <div className={styles.commentLine}>
                {data.like ? (
                  <IconButton onClick={() => putLike(false)}  aria-label="like" size="small" color="default">
                    <FavoriteIcon fontSize="inherit"/>
                  </IconButton>
                ) : (
                  <IconButton onClick={() => putLike(true)} aria-label="like" size="small" color="default">
                    <FavoriteBorderIcon  fontSize="inherit"/>
                  </IconButton>
                )}
                {data.comment === "" ? (
                 ""
                ) : (
                  <IconButton  onClick={() => setShowEditComment(true)} aria-label="edit"  size="small" color="default">
                  <EditIcon fontSize="inherit"/>
                </IconButton>
                  )}
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
