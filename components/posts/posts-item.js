import Link from "next/link";
import styles from "./post-item.module.css";
import Image from "next/image";

export default function PostItem(props) {
  const { title, image, excerpt, date, slug } = props.post;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const imagePath = `/images/posts/${slug}/${image}`;

  return (
    <li className={styles.post} key={slug}>
      <Link href={`/posts/${slug}`}>
        <div className={styles.image}>
          <Image src={imagePath} alt={title} width={300} height={200} />
        </div>
        <div className={styles.content}>
          <h3>{title}</h3>
          <time>{formattedDate}</time>
          <p>{excerpt}</p>
        </div>
      </Link>
    </li>
  );
}
