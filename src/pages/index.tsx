import FeaturedPosts from "@/components/home-page/featured-posts";
import Hero from "@/components/home-page/hero";
import { PostType } from "@/lib/types/post";
import { getFeaturedPosts } from "@/lib/server/posts";
import Head from "next/head";

type PropsType = {
  posts: Array<PostType>;
};

function HomePage({ posts }: PropsType) {
  return (
    <>
      <Head>
        <title>Michael's Blog</title>
        <meta
          name="description"
          content="Blog example project, based on NextJS 13 Pages Router"
        />
      </Head>
      <Hero />
      <FeaturedPosts posts={posts} />
    </>
  );
}

export function getStaticProps() {
  const featuredPosts = getFeaturedPosts();
  return {
    props: {
      posts: featuredPosts,
    },
  };
}

export default HomePage;
