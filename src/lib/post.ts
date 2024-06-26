import { promises as fs } from 'fs'
import path from 'path'
import dayjs from 'dayjs'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { sync } from 'glob'
import { Post } from '@/types/post'

const BASE_PATH = '/src/posts'
const POSTS_PATH = path.join(process.cwd(), BASE_PATH)

// MDX 파일 파싱 : abstract / detail 구분
export const parsePost = async (postPath: string): Promise<Post> => {
  const postAbstract = parsePostAbstract(postPath)
  const postDetail = await parsePostDetail(postPath)
  return { ...postAbstract, ...postDetail } as Post
}

// MDX Abstract
// url, cg path, cg name, slug
export const parsePostAbstract = (postPath: string) => {
  const posixPostPath = postPath.split(path.sep).join(path.posix.sep)
  const posixBasePath = BASE_PATH.split(path.sep).join(path.posix.sep)

  // category1/title1/content
  const filePath = posixPostPath
    .slice(posixPostPath.indexOf(posixBasePath) + posixBasePath.length + 1) // +1 to remove the trailing slash
    .replace('.mdx', '')

  // category1, title1
  const [category, slug] = filePath.split('/')

  // /blog/category1/title1
  const url = `/blog/${category}/${slug}`

  return { url, category, slug }
}

// MDX Detail
const parsePostDetail = async (postPath: string) => {
  const file = await fs.readFile(postPath, 'utf8')
  const { data, content } = matter(file)
  const grayMatter = data
  const readingMinutes = Math.ceil(readingTime(content).minutes)
  const dateString = dayjs(grayMatter.date)
    .locale('ko')
    .format('YYYY년 MM월 DD일')
  return {
    title: grayMatter.title || '',
    date: grayMatter.date || '',
    desc: grayMatter.desc || '',
    thumbnail: grayMatter.thumbnail || '',
    dateString,
    content,
    readingMinutes,
  }
}

// 모든 MDX 파일 조회
export const getPostPaths = (category?: string) => {
  const folder = category || '**'
  const paths: string[] = sync(`${POSTS_PATH}/${folder}/**/*.mdx`)
  return paths
}

// 모든 포스트 목록 조회
export const getPostList = async (category?: string): Promise<Post[]> => {
  const paths: string[] = getPostPaths(category)
  const posts = await Promise.all(paths.map((postPath) => parsePost(postPath)))
  return posts
}

export const getPostDetail = async (
  category: string,
  slug: string,
): Promise<Post> => {
  const postPath = path.join(
    process.cwd(),
    BASE_PATH,
    category,
    slug,
    'content.mdx',
  )

  const file = await fs.readFile(postPath, 'utf8')

  const { data, content } = matter(file)

  const grayMatter = data
  const readingMinutes = Math.ceil(readingTime(content).minutes)
  const dateString = dayjs(grayMatter.date)
    .locale('ko')
    .format('YYYY년 MM월 DD일')
  return {
    title: grayMatter.title || '',
    date: grayMatter.date || '',
    desc: grayMatter.desc || '',
    thumbnail: grayMatter.thumbnail || '',
    dateString,
    content,
    readingMinutes,
    url: `/blog/${category}/${slug}`,
    category,
    slug,
  }
}

// BASE_PATH에 있는 폴더 이름 목록 반환
export const getCategoryList = async (): Promise<string[]> => {
  const entries = await fs.readdir(POSTS_PATH, { withFileTypes: true })
  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
  return directories
}
