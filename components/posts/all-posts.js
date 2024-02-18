import styles from "./all-posts.module.css";
import PostGrid from "./posts-grid";

export default function AllPosts(props) {
  const { posts } = props;
  return (
    <section className={styles.posts}>
      <h1>All Posts</h1>
      <PostGrid posts={posts} />
    </section>
  );
}
