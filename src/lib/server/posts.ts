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

export function getSlugFromFilename(filename: string, language: string) {
  const withoutExt = removeFileExtension(filename);
  const suffix = `.${language}`;
  if (withoutExt.endsWith(suffix)) {
    return withoutExt.slice(0, -suffix.length);
  }
  return withoutExt;
}

export function getPostsFilenames(language: string) {
  return fs
    .readdirSync(postsDirectoryPath)
    .filter((filename) => filename.endsWith(`.${language}.md`));
}

export function getPostData(postSlug: string, language: string) {
  const filePath = path.join(postsDirectoryPath, `${postSlug}.${language}.md`);
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
  const slugs = postFiles.map((file) => getSlugFromFilename(file, language));
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
