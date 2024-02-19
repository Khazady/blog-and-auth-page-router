import PostHeader from "./post-header";
import styles from "./post-content.module.css";
import ReactMarkdown from "react-markdown";
import { PostType } from "@/lib/types/post";
import Image from "next/image";

type PropsType = {
  post: PostType;
};

export default function PostContent(props: PropsType) {
  let { post } = props;
  const imagePath = `/images/posts/${post.slug}/${post.image}`;

  return (
    <article className={styles.content}>
      <PostHeader title={post.title} image={imagePath} />
      <ReactMarkdown
        components={{
          img: (image) => (
            <Image
              priority
              className={styles.image}
              src={`/images/posts/${post.slug}/${image.src}`}
              alt={image.alt || "Additional image in Post body"}
              width={600}
              height={300}
            />
          ),
        }}
      >
        {post.content}
      </ReactMarkdown>
    </article>
  );
}
