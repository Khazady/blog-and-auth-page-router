import Head from "next/head";

export default function MainHead() {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="#221F23"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="#A7A3AE"
      />
      <meta property="og:title" content="Michael's Blog" />
      <meta property="og:site_name" content="khazady.github.io" />
      <meta
        property="og:url"
        content="https://khazady.github.io/blog-page-router"
      />
      <meta
        property="og:description"
        content="Blog example project, based on NextJS 13 Pages Router"
      />
      <meta
        property="og:image"
        content="https://i.ibb.co/L1qjJnZ/Screenshot-2024-02-20-at-13-03-33.png"
      />
    </Head>
  );
}
