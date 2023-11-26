import Document,{Html,Head,Main,NextScript} from "next/document";
import {ServerStyleSheet} from "styled-components";
import c from "@constants/Common";

export default class CustomDocument extends Document
{
    static async getInitialProps(context) {
        const initialProps = await Document.getInitialProps(context);
        const sheet = new ServerStyleSheet();
        const page = context.renderPage((App) => (props) => sheet.collectStyles(<App {...props} />));
        const styleTags = sheet.getStyleElement();
        return {...initialProps,...page,styleTags,host: context.req ? context.req.hostname ? context.req.hostname : "" : ""};
    }
    render(){
        return (
            <Html lang="en">
                <Head>
                    <link rel="dns-prefetch" href="//fonts.googleapis.com"/>
                    <link rel="dns-prefetch" href="//www.googletagmanager.com"/>
                    <link rel="dns-prefetch" href="//www.google-analytics.com"/>
                    <link rel="dns-prefetch" href="//www.google.com"/>
                    <link rel="dns-prefetch" href="//www.google.co.in"/>
                    <link rel="dns-prefetch" href="//schema.org"/>
                    <link rel="dns-prefetch" href={c.BASE_URL}/>
                    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"/>
                    <link rel="stylesheet" href={`${c.BASE_URL}/assets/css/style.css`}/>
                    <link rel="shortcut icon" href={`${c.BASE_URL}/assets/images/favicon.png`}/>
                    <meta name="viewport" content="minimum-scale=1,initial-scale=1,width=device-width,shrink-to-fit=no,user-scalable=no,viewport-fit=cover"/>
                </Head>
                <body>
                    {this.props.styleTags}
                    <Main/>
                    <NextScript/>
                    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet"/>
                </body>
            </Html>
        );
    }
}