import Head from 'next/head';

export default ({ children }) => (
    <div>
      <Head>
        <title>Carto Test</title>
        <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Roboto:100,400,700" rel="stylesheet" type="text/css" />
      </Head>
      {children}
    </div>
)
