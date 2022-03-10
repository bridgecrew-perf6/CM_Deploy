import Document, { Head, Html, Main, NextScript } from "next/document";


class CustomDocument extends Document {
    render(): JSX.Element {
        return <Html lang="ko">
            <Head>
                <link 
                href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo&display=swap"
                rel="stylesheet"
                / >
            </Head>
            <body>
                <Main></Main>
                <NextScript></NextScript>
            </body>
        </Html>
    }
};

export default CustomDocument;

{/* 
    폰트 설정을 해주는 방법은 기존과 같다. 헤드태그에 구글에서 제공하는 폰트를 가져다가 위 방법처럼 링크태그를 넣는법.
    여기서 중요한것은 폰트는 구글폰트에서 제공하는 폰트를 사용해야 한다는점인데, 그 이유는 바로 NextJS의 폰트 최적화는 구글폰트에서 제공하는 폰트를 기반으로 하기 때문이다.
    
*/}