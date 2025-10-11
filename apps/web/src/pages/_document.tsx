import Document, { Html, Head, Main, NextScript } from 'next/document';

type Theme = 'light' | 'dark';

interface DocumentProps {
  initialTheme: Theme;
}

const themeScript = `
  (function() {
    function getTheme() {
      var match = document.cookie.replace(/(?:(?:^|.*;)\\s*theme\\s*=\\s*([^;]*).*$)|^.*$/, '$1');
      if (match === 'light' || match === 'dark') {
        return match;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', getTheme());
  })();
`;

const themeScriptProps = { __html: themeScript };

export default class MyDocument extends Document<DocumentProps> {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <script dangerouslySetInnerHTML={themeScriptProps} />
        </Head>
        <body className='antialiased'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
