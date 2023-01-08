import styles from "./Comments.module.css";

export default function Comment({ name, like, text, img, byUser }) {
   const heartIcon = like ? "/heartIconFill.svg" : "/heartIcon.svg";

  return (
    <>
      <div className={styles.comment}>
          <div className={styles.pfpContainer}>
          <img src={img} className={styles.commentPfp} />
          </div>
          <div >
            <div className={styles.commentLine}>
              <p className={styles.commentName}>{name}</p>
              
              <img className={styles.commentHeart} src={heartIcon} />
              {byUser ? (
                <div className={styles.commentLine}>
              <img className={styles.commentHeart} src="/editIcon.svg" />
              <img className={styles.commentHeart} src="/deleteIcon.svg" />
              </div>
              )
              :""}
            </div>

            <p className={styles.commentText}> 
              {text}
            </p>
          </div>
        </div>
    </>
  );
}
