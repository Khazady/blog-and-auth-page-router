import Hero from "../components/home-page/hero";
import FeaturedPosts from "../components/home-page/featured-posts";

const MOCK_POSTS = [
    {
        slug: "getting-started-nextjs",
        title: "Next JS Post 1",
        image: "getting-started-nextjs.png",
        excerpt: "Next.js is a JavaScript framework for building user interfaces.",
        date: "2021-01-01",
    },   {
        slug: "getting-started-nextjs",
        title: "Next JS",
        image: "getting-started-nextjs.png",
        excerpt: "Next.js is a JavaScript framework for building user interfaces.",
        date: "2021-01-01",
    },   {
        slug: "getting-started-nextjs",
        title: "Next JS",
        image: "getting-started-nextjs.png",
        excerpt: "Next.js is a JavaScript framework for building user interfaces.",
        date: "2021-01-01",
    },   {
        slug: "getting-started-nextjs",
        title: "Next JS",
        image: "getting-started-nextjs.png",
        excerpt: "Next.js is a JavaScript framework for building user interfaces.",
        date: "2021-01-01",
    },

]

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedPosts posts={MOCK_POSTS} />
    </>
  );
}

export default HomePage;
