import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostType } from "@/lib/types/post";
import { removeFileExtension } from "@/lib/utils";

const postsRootPath = path.join(process.cwd(), "public", "content", "posts");

function getPostsDirectory(language: string) {
  return path.join(postsRootPath, language);
}

export function getPostsFilenames(language: string) {
  return fs
    .readdirSync(getPostsDirectory(language))
    .filter((filename) => filename.endsWith(".md"));
}

export function getPostData(postSlug: string, language: string) {
  const filePath = path.join(getPostsDirectory(language), `${postSlug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const postData = {
    ...data,
    content,
    slug: postSlug,
  };
  return postData as PostType;
}

export function getAllPosts(language: string) {
  const postFiles = getPostsFilenames(language);
  const slugs = postFiles.map((file) => removeFileExtension(file));
  const allPosts = slugs.map((slug) => getPostData(slug, language));

  const sortedPosts = allPosts.sort((postA, postB) =>
    postA.date > postB.date ? -1 : 1,
  );

  return sortedPosts;
}

export function getFeaturedPosts(language: string) {
  const allPosts = getAllPosts(language);
  const featuredPosts = allPosts.filter((post) => post.isFeatured);

  return featuredPosts;
}
