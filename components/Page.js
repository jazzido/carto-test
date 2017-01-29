import React from 'react';
import Head from 'next/head';

export default ({ children }) => (
    <main className="wrapper">
      <Head>
        <title>Carto Test</title>
        <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
        <link rel="stylesheet" href="//cdn.rawgit.com/necolas/normalize.css/master/normalize.css" />
        <link rel="stylesheet" href="//cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css" />
        <link rel="stylesheet" href="/static/carto.css" />
      </Head>
      {children}
    </main>
);
