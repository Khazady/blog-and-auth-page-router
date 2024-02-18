import PostHeader from "./post-header";
import styles from './post-content.module.css'

const MOCK_POST =   {
    slug: "getting-started-nextjs",
    title: "Next JS Post 1",
    image: "getting-started-nextjs.png",
    excerpt: "Next.js is a JavaScript framework for building user interfaces.",
    date: "2021-01-01",
    content: '# This is a first post'
}

export default function PostContent(props) {
    let { post } = props;
    post = MOCK_POST
    const imagePath = `/images/posts/${post.slug}/${post.image}`;

    return <article className={styles.content}>
        <PostHeader title={post.title} image={imagePath}/>
        {post.content}
    </article>
}
