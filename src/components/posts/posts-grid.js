import PostsItem from "./posts-item";
import styles from "./posts-grid.module.css";

export default function PostGrid(props) {
  const { posts } = props;
  return (
    <ul className={styles.grid}>
      {posts.map((post) => (
        <PostsItem key={post.slug} post={post} />
      ))}
    </ul>
  );
}
