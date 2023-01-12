import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
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
        </footer>
        </Html>
    )
}