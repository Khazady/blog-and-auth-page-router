import AllPosts from "../../components/posts/all-posts";

const MOCK_POSTS = [
  {
    slug: "getting-started-nextjs",
    title: "Next JS Post 1",
    image: "getting-started-nextjs.png",
    excerpt: "Next.js is a JavaScript framework for building user interfaces.",
    date: "2021-01-01",
  },
  {
    slug: "getting-started-nextjs",
    title: "Next JS",
    image: "getting-started-nextjs.png",
    excerpt: "Next.js is a JavaScript framework for building user interfaces.",
    date: "2021-01-01",
  },
  {
    slug: "getting-started-nextjs",
    title: "Next JS",
    image: "getting-started-nextjs.png",
    excerpt: "Next.js is a JavaScript framework for building user interfaces.",
    date: "2021-01-01",
  },
  {
    slug: "getting-started-nextjs",
    title: "Next JS",
    image: "getting-started-nextjs.png",
    excerpt: "Next.js is a JavaScript framework for building user interfaces.",
    date: "2021-01-01",
  },
];

export default function PostsPage() {
  return <AllPosts posts={MOCK_POSTS} />;
}
