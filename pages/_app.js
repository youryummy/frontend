import "../styles/globals.css";

import App from 'next/app'
import Menu from "../components/Menu";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { Provider, useSelector, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { setState as setToken } from "../store/token";
import { persistor, store } from "../store/store";

import { useEffect } from "react";
import * as jwt from 'jose';

const AppWrapper = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <MyApp Component={Component} pageProps={pageProps} />
      </PersistGate>
    </Provider>
  );
}

const MyApp = ({ Component, pageProps }) => {
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => Object.keys(state.token).length > 0);

  useEffect(() => {
    dispatch(setToken(pageProps.user));
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
          <Stack direction="row" maxWidth={"100%"}>
            { isLogged ? <Menu></Menu> : null }
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

AppWrapper.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  const authToken = appContext.ctx.req?.cookies.authToken;

  if (authToken) {
    try {
      appProps.pageProps.user = jwt.decodeJwt(authToken); // Verification is done in the middleware (server side)
    } catch (error) {
      console.error("Error getting decoding jwt token", error);
    }
  }
  return { ...appProps }
}

export default AppWrapper;
