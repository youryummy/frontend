import "../styles/globals.css";

import App from 'next/app'
import Menu from "../components/Menu";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { Provider, useSelector, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { setState as setToken } from "../store/token";
import { persistor, store } from "../store/store";

import CookieConsent, { Cookies } from "react-cookie-consent";
import { useState, useEffect } from "react";
import * as jwt from 'jose';

const AppWrapper = ({ Component, pageProps }) => {
  const [showCookieConsent, setShowCookieConsent] = useState((Cookies.get("CookieConsent") === "true") ? "hidden" : "show");
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <MyApp Component={Component} pageProps={pageProps} />
        <CookieConsent
          visible={showCookieConsent}
          style={{ background: "#772318" }}
          buttonText="Acepto"
          buttonStyle={{ backgroundColor: 'white' }}
          expires={150}
          hideOnAccept
          onAccept={() => setShowCookieConsent("hidden")}>
          Esta web utiliza cookies para mejorar su experiencia de navegación. Consulte los <a href="/about/terms"><b>términos del servicio</b></a> para más información. Si continúa navegando, consideramos que acepta su uso.
        </CookieConsent>
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
