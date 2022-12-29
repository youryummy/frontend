import Image from "next/image";
import styles from "./Register.module.css";
import Paper from "@mui/material/Paper";
import Logo from "../../public/logo.png";
import { setField, validateField, register } from "./api";
import { TextField, Button, IconButton } from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useState } from "react";

export default function Login() {
  const [data, setData] = useState({username: "", password: "", fullName: "", avatar: null, email: "", birthDate: "", cellPhone: ""});
  const [error, setError] = useState({username: "", password: "", fullName: "", email: "", birthDate: "", cellPhone: ""});

  return (
    <div className={styles.registerComponent}>
      <Paper className={styles.card} elevation={6} >

        { /* Logo */ }
        <div className={styles.logo} style={{}}>
          <Image src={Logo} fill/>
        </div>

        { /* Avatar, username and password*/ }
        <div style={{display: "flex", flexDirection: "row", gap: "20px", width: "100%"}}>
          <IconButton className={styles.uploadImage} sx={{backgroundImage: data.avatar ? `url(${data.avatar.url})` : null}} component="label">
            <input onChange={ (ev) => setField(setData, ev.target.files?.[0], "avatar")} hidden accept="image/*" type="file" />
            {data.avatar ? null : <PhotoCamera/>}
          </IconButton>
          <div style={{display: "flex", flexDirection: "column", gap: "20px", width: "100%"}}>
            <TextField value={data.username} onChange={(ev) => validateField(setData, setError, ev.target.value, "username")} error={error.username.length > 0 ? true : false} helperText={error.username} className={styles.formInput} required size="small" label="Username" variant="outlined" />
            <TextField value={data.password} onChange={(ev) => validateField(setData, setError, ev.target.value, "password")} error={error.password.length > 0 ? true : false} helperText={error.password} className={styles.formInput} required size="small" label="Password" variant="outlined" type={"password"}/>
          </div>
        </div>

        { /* Full name and email*/ }
        <TextField value={data.fullName} onChange={(ev) => validateField(setData, setError, ev.target.value, "fullName")} error={error.fullName.length > 0 ? true : false} helperText={error.fullName} className={styles.formInput} required size="small" label="Full Name" variant="outlined" />
        <TextField value={data.email} onChange={(ev) => validateField(setData, setError, ev.target.value, "email")} error={error.email.length > 0 ? true : false} helperText={error.email} className={styles.formInput} required size="small" label="Email" variant="outlined" type={"email"} />
        
        { /* Birth date and cell phone*/ }
        <div style={{display: "flex", flexDirection: "row", gap: "20px", width: "100%"}}>
          <TextField value={data.birthDate} onChange={(ev) => validateField(setData, setError, ev.target.value, "birthDate")} error={error.birthDate.length > 0 ? true : false} helperText={error.birthDate} className={styles.formInput} size="small" label="Birth Date" variant="outlined" type={"date"} InputLabelProps={{shrink: true}} />
          <TextField value={data.cellPhone} onChange={(ev) => validateField(setData, setError, ev.target.value, "cellPhone")} error={error.cellPhone.length > 0 ? true : false} helperText={error.cellPhone} className={styles.formInput} size="small" label="Cell Phone" variant="outlined" type={"tel"} />
        </div>

        { /* Back and save buttons*/ }
        <div style={{display: "flex", flexDirection: "row", gap: "20px", width: "100%"}}>
          <Button onClick={() => window.location.href = "/login"} className={styles.backButton} variant="contained">Back</Button>
          <Button onClick={() => register(data, setError)} className={styles.saveButton} variant="contained">Save</Button>
        </div>
      </Paper>
    </div>
  );
}
