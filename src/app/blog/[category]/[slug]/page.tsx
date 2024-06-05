import { getCategoryList, getPostList, getPostDetail } from '@/lib/post'
import PostHeader from '@/components/post/PostHeader'
import { PostBody } from '@/components/post/PostBody'
import { Aside } from '../../../../components/post/Aside/Aside'
import TableOfContent from '../../../../components/post/Aside/TableOfContents'
import { parseToc } from '../../../../mdx'

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
  const toc = parseToc(post.content)

  return (
    <div className="flex flex-row w-100">
      <Aside>
        <TableOfContent data-animate className="px-2 text-sm" toc={toc} />
      </Aside>{' '}
      <div className="main-box">
        <PostHeader post={post} />
        <PostBody post={post} />
      </div>
    </div>
  )
}

export default PostDetail
