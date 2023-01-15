import "../styles/globals.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store/store";
import { Provider } from "react-redux";

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
};

export default MyApp;
