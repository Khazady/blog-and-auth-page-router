import LanguageSwitcher from "@/components/ui/language-switcher";
import { PostType } from "@/lib/types/post";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import ts from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import materialDark from "react-syntax-highlighter/dist/cjs/styles/prism/material-dark"; // cjm for server side, not esm
import rehypeRaw from "rehype-raw";
import styles from "./post-content.module.css";
import PostHeader from "./post-header";

SyntaxHighlighter.registerLanguage("js", js); // this optimizes weight of react-syntax-highlighter lib by specifying the language
SyntaxHighlighter.registerLanguage("typescript", ts); // this optimizes weight of react-syntax-highlighter lib by specifying the language

type PropsType = {
  post: PostType;
};

const highlightByAnchorId = ({
  href,
  scroll,
}: {
  href: string;
  scroll?: boolean;
}) => {
  if (!href || !href.startsWith("#")) return;

  const targetId = decodeURIComponent(href.slice(1));
  const targetElement = document.getElementById(targetId);
  if (!targetElement) return;

  const parentElement = targetElement.closest("li, h3");
  const highlightTarget =
    parentElement instanceof HTMLElement ? parentElement : targetElement;

  highlightTarget.classList.add(styles.highlight);

  scroll &&
    highlightTarget.scrollIntoView({ block: "center", behavior: "smooth" });
};
const blockquoteStyles = {
  margin: 0,
  padding: "1em",
  background: "#EBEBEB",
  borderLeft: "3px solid #ADD8E6",
};
export default function PostContent(props: PropsType) {
  let { post } = props;
  const imagePath = `/images/posts/${post.slug}/${post.image}`;

  const handleLinkClick = async (event: React.MouseEvent, href: string) => {
    //clean previous highlights
    document
      .querySelectorAll(`.${styles.highlight}`)
      .forEach((el) => el.classList.remove(styles.highlight));

    highlightByAnchorId({ href });
  };

  useEffect(() => {
    highlightByAnchorId({ href: window.location.hash });
  }, [post.slug]);

  return (
    <article className={styles.content}>
      <div className={styles.languageSwitcher}>
        <LanguageSwitcher />
      </div>
      <PostHeader title={post.title} image={imagePath} />
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
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
          blockquote: ({ children }) => (
            <blockquote style={blockquoteStyles}>{children}</blockquote>
          ),
          a: ({ children, href }) => {
            return (
              href && (
                <Link
                  className={styles.link}
                  onClick={(event) => handleLinkClick(event, href)}
                  scroll={false}
                  href={href}
                >
                  {children}
                </Link>
              )
            );
          },
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
