import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const postsDirectoryPath = path.join(
  process.cwd(),
  "public",
  "content",
  "posts",
);

async function getPostData(fileName) {
  const filePath = path.join(postsDirectoryPath, fileName);
  const fileContent = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const postSlug = fileName.replace(/\.mdx?$/, ""); //removes file extension
  const postData = {
    ...data,
    content,
    slug: postSlug,
  };
  return postData;
}

export async function getAllPosts() {
  const postFiles = await fs.readdir(postsDirectoryPath);

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
