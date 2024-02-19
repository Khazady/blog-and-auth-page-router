import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostType } from "@/lib/types/post";
import { removeFileExtension } from "@/lib/utils";

const postsDirectoryPath = path.join(
  process.cwd(),
  "public",
  "content",
  "posts",
);

export function getPostsFilenames() {
  return fs.readdirSync(postsDirectoryPath);
}

export function getPostData(postIdentifier: string) {
  const postSlug = removeFileExtension(postIdentifier);
  const filePath = path.join(postsDirectoryPath, `${postSlug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const postData = {
    ...data,
    content,
    slug: postSlug,
  };
  return postData as PostType;
}

export function getAllPosts() {
  const postFiles = getPostsFilenames();

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
