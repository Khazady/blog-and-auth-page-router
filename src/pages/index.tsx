import FeaturedPosts from "@/components/home-page/featured-posts";
import Hero from "@/components/home-page/hero";
import { PostType } from "@/lib/types/post";
import { getFeaturedPosts } from "@/lib/post-util";

type PropsType = {
  posts: Array<PostType>;
};

function HomePage({ posts }: PropsType) {
  return (
    <>
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
