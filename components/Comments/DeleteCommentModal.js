import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import styles from "./Comments.module.css";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
}));

export default function DeleteCommentModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div style={{alignSelf: "center"}}>
      <IconButton onClick={handleOpen} aria-label="delete"  size="small" color="default" >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Item style={{ borderRadius: "20px", height: "auto", padding: "20px" }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete this comment?
          </Typography>
          <div className={styles.deleteButtons}>
          <div style={{marginRight: "10px"}}>
          <Button onClick={() => ""} className={styles.cancelButton} variant="contained">Cancel</Button>
          </div>
          <Button onClick={() => ""} className={styles.postButton} variant="contained">Delete</Button>
          </div>
          
        </Item>
      </Modal>
    </div>
  );
}



