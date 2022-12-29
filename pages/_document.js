import { Html, Head, Main, NextScript } from 'next/document'
import CookieConsent, { Cookies } from "react-cookie-consent";
import { useState } from "react";

export default function Document() {
    const [showCookieConsent, setShowCookieConsent] = useState((Cookies.get("CookieConsent") === "true") ? "hidden" : "show");
    return (
        <Html>
        <Head>
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href='/logo.png' />
            <link rel="icon" href='/logo.png' />
            <meta name="theme-color" content="#f0f0f0" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
        <footer>
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
        </footer>
        </Html>
    )
}