import PostHeader from "./post-header";
import styles from "./post-content.module.css";
import ReactMarkdown from "react-markdown";
import { PostType } from "@/lib/types/post";
import Image from "next/image";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import materialDark from "react-syntax-highlighter/dist/cjs/styles/prism/material-dark"; // cjm for server side, not esm
import js from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";

SyntaxHighlighter.registerLanguage("js", js); // this optimizes weight of react-syntax-highlighter lib by specifying the language

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
          code: (code) => {
            const { className, children } = code;
            if (typeof children !== "string" || !className) {
              return <code>{children}</code>;
            }
            const language = className.split("-")[1]; // className is something like language-js => We need the "js" part here
            return (
              <SyntaxHighlighter
                style={materialDark}
                language={language}
                children={children}
              />
            );
          },
        }}
      >
        {post.content}
      </ReactMarkdown>
    </article>
  );
}
