import { useSelector } from "react-redux";

export default function Profile() {
  // in logout function change isLogged to false
  const isGoogleLogin = useSelector((state) => state.googleLogin.isLogged);
  console.log(isGoogleLogin);
  return <div>Profile</div>;
}
