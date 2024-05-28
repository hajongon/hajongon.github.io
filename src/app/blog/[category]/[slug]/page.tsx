import { getPostDetail } from '@/lib/post'
import PostHeader from '@/components/PostHeader'
import { PostBody } from '@/components/PostBody'

type PostDetailProps = {
  params: {
    category: string
    slug: string
  }
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
