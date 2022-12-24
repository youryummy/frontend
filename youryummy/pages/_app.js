import "../styles/globals.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store/store";
import { Provider } from "react-redux";
import Menu from "./Menu";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Stack direction="row" maxWidth={"100%"}>
          <Menu></Menu>
          <Box
            bgcolor={"#F9FAFA"}
            height={"100vh"}
            width={"100%"}
            style={{ maxHeight: "100vh", overflowY: "auto" }}
          >
            <Component {...pageProps} />
          </Box>
        </Stack>
      </PersistGate>
    </Provider>
  );
};

export default MyApp;
