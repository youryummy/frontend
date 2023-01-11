import Image from "next/image";
import styles from "./Login.module.css";
import Paper from "@mui/material/Paper";
import Logo from "../../public/logo.png";
import { TextField, Button } from "@mui/material";
import { validateInput, login } from "./api";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({username: "", password: ""});

  return (
    <div className={styles.loginComponent}>
      <Paper className={styles.card} elevation={6} >
        <div className={styles.logo} style={{}}>
          <Image src={Logo} fill/>
        </div>
        <TextField value={username} onChange={(ev) => validateInput(ev.target.value, "username", setUsername, setError)} error={error.username.length > 0 ? true : false} helperText={error.username} className={styles.formInput} size="small" label="Username" variant="outlined" />
        <TextField value={password} onChange={(ev) => validateInput(ev.target.value, "password", setPassword, setError)} error={error.password.length > 0 ? true : false} helperText={error.password} className={styles.formInput} size="small" label="Password" variant="outlined" type={"password"}/>
        <Button onClick={() => login(username, password, setError)} className={styles.loginButton} variant="contained">Sign In</Button>
        <Button onClick={() => router.push("/register")} className={styles.signUpButton} variant="contained">Sign Up</Button>
      </Paper>
    </div>
  );
}
