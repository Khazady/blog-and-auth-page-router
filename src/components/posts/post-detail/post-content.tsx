import PostHeader from "./post-header";
import styles from "./post-content.module.css";
import ReactMarkdown from "react-markdown";
import { PostType } from "@/lib/types/post";

type PropsType = {
  post: PostType;
};

export default function PostContent(props: PropsType) {
  let { post } = props;
  const imagePath = `/images/posts/${post.slug}/${post.image}`;

  return (
    <article className={styles.content}>
      <PostHeader title={post.title} image={imagePath} />
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  );
}
