import AllPosts from "@/components/posts/all-posts";
import { getAllPosts } from "@/lib/post-util";
import { PostType } from "@/lib/types/post";

type PropsType = {
  posts: Array<PostType>;
};

export default function AllPostsPage({ posts }: PropsType) {
  return <AllPosts posts={posts} />;
}

export function getStaticProps() {
  const allPosts = getAllPosts();
  return {
    props: {
      posts: allPosts,
    },
  };
}
