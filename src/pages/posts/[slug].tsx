import PostContent from "@/components/posts/post-detail/post-content";
import { getPostData, getPostsFilenames } from "@/lib/post-util";
import { PostType } from "@/lib/types/post";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { removeFileExtension } from "@/lib/utils";

interface Params extends ParsedUrlQuery {
  slug: string;
}

type PropsType = {
  post: PostType;
};

const PostDetailPage: NextPage<PropsType> = ({ post }) => {
  return <PostContent post={post} />;
};

export const getStaticProps: GetStaticProps<PropsType, Params> = (context) => {
  const { params } = context;

  if (!params) {
    return {
      notFound: true,
    };
  }

  const postData = getPostData(params.slug);
  return {
    props: {
      post: postData,
    },
    // to not rebuild after updating an markdown file
    revalidate: 60 * 10,
  };
};

export const getStaticPaths: GetStaticPaths<Params> = (context) => {
  const postFilenames = getPostsFilenames();
  const slugs = postFilenames.map(removeFileExtension);
  const paths = slugs.map((slug) => ({ params: { slug } }));
  return {
    paths,
    // since app will not have a lot of posts, it's not a problem to prerender them all
    fallback: false,
  };
};

export default PostDetailPage;
