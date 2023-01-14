import { 
  Typography,
  TextField,
  Button, 
  IconButton, 
} from "@mui/material";
import Avatar from '@mui/material/Avatar';
import styles from "./Profile.module.css";
import Paper from "@mui/material/Paper";
import { fetchData } from "./api";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOffIcon from '@mui/icons-material/EditOff';
import CircularProgress from '@mui/material/CircularProgress';
import SadFace from '@mui/icons-material/SentimentVeryDissatisfied';
import { validateField, modify, upgradePlan, deleteAccount } from "./api";

import UploadImage from "../../components/UploadImage.js";
import Plans from "../../components/Plans.js";


export default function Profile() {
    const router = useRouter();
    const { username } = router.query;
    const tokenUsername = useSelector((state) => state.token?.username);

    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ loadingButton, setLoadingButton ] = useState(false);
    const [ edit, setEdit ] = useState(false);
    const [error, setError] = useState({username: "", password: "", fullName: "", email: "", birthDate: "", cellPhone: ""});

    useEffect(() => { if (!edit) fetchData(`/api/v1/accounts/${username}`, setData, setLoading)}, [edit]);

    if (loading) return <div className={styles.profileComponent} style={{justifyContent: "center"}}><CircularProgress /></div>;
    if (!data) return <div className={styles.profileComponent} style={{justifyContent: "center"}}><SadFace className={styles.notFoundError} /><b style={{color: "grey"}}>No Data Found</b></div>;

    /* VIEW MODE */
    if (!edit) return (
      <div className={styles.profileComponent}>
        <Paper className={styles.card} elevation={6} >
          <div className={styles.infoWrapper}>
            <Avatar className={styles.avatar} alt={data.fullName.toUpperCase()} src={data.avatar ?? "/broken"}/>
            <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
              <span style={{display: "inline-flex", alignItems: "flex-end", gap: "15px"}}>
              <Typography sx={{textTransform: "capitalize", fontWeight: "600"}} variant='h3'>{data.fullName}</Typography>
              <Typography sx={{textDecoration: "underline", color: "gray"}} variant='h6'>@{data.username}</Typography>
              </span>
              <Typography className={styles.userInfo}>Email: <i>{data.email}</i></Typography>
              {data.cellPhone && username === tokenUsername ? <Typography className={styles.userInfo}>Phone: <i>{data.cellPhone}</i></Typography> : null }
              {data.birthDate  && username === tokenUsername? <Typography className={styles.userInfo}>Birth Date: <i>{data.birthDate}</i></Typography> : null }
              <span style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                <Button className={styles.userPlan} variant="outlined" size="medium" disabled>{data.plan} Plan</Button>
                {data.plan !== "premium" && username === tokenUsername ? 
                  <Plans 
                    popover
                    payment 
                    paymentProps={{
                      currentPlan: data.plan,
                      onSuccess: (newPlan) => upgradePlan(username, newPlan, data).then(() => fetchData(`/api/v1/accounts/${username}`, setData, setLoading)),
                      onError: (err) => {alert("Error in the transaction."); console.log(err)}
                    }}
                    popoverProps={{buttonText: "Want more? Go premium!"}}/>
                  : null}
              </span>
            </div>
          </div>
          { username === tokenUsername ?
            <span style={{position: "absolute", right: "15px", top: "15px", display: "inline-flex"}}>
            <IconButton onClick={() => {confirm("Are you sure you want to delete the account?") ? deleteAccount(username) : null}} aria-label="delete" size="large">
              <DeleteIcon fontSize="inherit" color="error" />
            </IconButton> 
            <IconButton onClick={() => setEdit(true)}  aria-label="modify" size="large">
              <EditIcon fontSize="inherit" />
            </IconButton> 
            </span>
            : null
          }
        </Paper>

        { //TODO Add recipe cards
        }
      </div>
    ) 
    
    /* EDIT MODE */
    else return (
      <div className={styles.profileComponent}>
        <Paper className={styles.card} elevation={6} >

          <div className={styles.basicInfoForm}>
            <UploadImage data={data} setData={setData} d={200}/>
            <span style={{display: "flex", flexDirection: "column", gap: "30px", width: "100%"}}>
              <TextField value={data.fullName} onChange={(ev) => validateField(setData, setError, ev.target.value, "fullName")} error={error.fullName.length > 0 ? true : false} helperText={error.fullName} className={styles.formInput} size="small" label="Name" variant="outlined" />
              <TextField value={data.username} onChange={(ev) => validateField(setData, setError, ev.target.value, "username")} error={error.username.length > 0 ? true : false} helperText={error.username} className={styles.formInput} size="small" label="Username" variant="outlined" />
              <TextField value={data.password} onChange={(ev) => validateField(setData, setError, ev.target.value, "password")} error={error.password.length > 0 ? true : false} helperText={error.password} className={styles.formInput} size="small" label="Password" variant="outlined" type="password" InputLabelProps={{ shrink: true}} placeholder={"New Password"}/>
            </span>
          </div>
          <TextField value={data.email} onChange={(ev) => validateField(setData, setError, ev.target.value, "email")} error={error.email.length > 0 ? true : false} helperText={error.email} className={styles.formInput} size="small" label="Email" variant="outlined" type={"email"} />
          <TextField value={data.birthDate} onChange={(ev) => validateField(setData, setError, ev.target.value, "birthDate")} error={error.birthDate.length > 0 ? true : false} helperText={error.birthDate} className={styles.formInput} size="small" label="Birth Date" variant="outlined" type={"date"} InputLabelProps={{shrink: true}} />
          <TextField value={data.cellPhone} onChange={(ev) => validateField(setData, setError, ev.target.value, "cellPhone")} error={error.cellPhone.length > 0 ? true : false} helperText={error.cellPhone} className={styles.formInput} size="small" label="Cell Phone" variant="outlined" type={"tel"} InputLabelProps={{shrink: true}} placeholder={"123 456 789"}/>

          <span style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "flex-end"}}>
            <Button onClick={() => {setLoadingButton(true); modify(username, data, setError, setEdit).finally(() => setLoadingButton(false))}} className={styles.saveButton} variant="contained" size="large" disabled={loadingButton}>
              {loadingButton ? 
                <CircularProgress size={24} color="inherit" /> :
                "Save"
              }
            </Button>
          </span>

          <IconButton onClick={() => setEdit(false)} sx={{position: "absolute", right: "15px", top: "15px"}} aria-label="delete" size="large">
            <EditOffIcon fontSize="inherit" />
          </IconButton>
        </Paper>
      </div>
    );
  }
