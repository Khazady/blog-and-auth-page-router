import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostType } from "@/lib/types/post";

const postsDirectoryPath = path.join(
  process.cwd(),
  "public",
  "content",
  "posts",
);

function getPostData(fileName: string) {
  const filePath = path.join(postsDirectoryPath, fileName);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const postSlug = fileName.replace(/\.mdx?$/, ""); //removes file extension
  const postData = {
    ...data,
    content,
    slug: postSlug,
  };
  return postData as PostType;
}

export function getAllPosts() {
  const postFiles = fs.readdirSync(postsDirectoryPath);

  const allPosts = postFiles.map(getPostData);

  const sortedPosts = allPosts.sort((postA, postB) =>
    postA.date > postB.date ? -1 : 1,
  );

  return sortedPosts;
}

export function getFeaturedPosts() {
  const allPosts = getAllPosts();
  const featuredPosts = allPosts.filter((post) => post.isFeatured);

  return featuredPosts;
}
