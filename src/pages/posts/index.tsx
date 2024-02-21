import AllPosts from "@/components/posts/all-posts";
import { getAllPosts } from "@/lib/api/server/post";
import { PostType } from "@/lib/types/post";
import Head from "next/head";

type PropsType = {
  posts: Array<PostType>;
};

export default function AllPostsPage({ posts }: PropsType) {
  return (
    <>
      <Head>
        <title>All my Posts</title>
        <meta
          name="description"
          content="A list of posts in Michael's blog related to programming."
        />
      </Head>
      <AllPosts posts={posts} />
    </>
  );
}

export function getStaticProps() {
  const allPosts = getAllPosts();
  return {
    props: {
      posts: allPosts,
    },
  };
}
