import { getCategoryList, getPostList, getPostDetail } from '@/lib/post'
import PostHeader from '@/components/post/PostHeader'
import { PostBody } from '@/components/post/PostBody'

type PostDetailProps = {
  params: {
    category: string
    slug: string
  }
}

type Params = {
  category: string
  slug: string
}

export async function generateStaticParams(): Promise<Params[]> {
  const categories = await getCategoryList()
  const paths: Params[] = []

  for (const category of categories) {
    const posts = await getPostList(category)
    posts.forEach((post) => {
      paths.push({
        category,
        slug: post.slug,
      })
    })
  }

  return paths
}

const PostDetail = async ({ params: { category, slug } }: PostDetailProps) => {
  const post = await getPostDetail(category, slug)

  return (
    <div>
      <PostHeader post={post} />
      <PostBody post={post} />
    </div>
  )
}

export default PostDetail
