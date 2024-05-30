import { getPostList } from '@/lib/post'
import Link from 'next/link'

type CategoryPageProps = {
  params: {
    category: string
  }
}

const CategoryPage = async ({ params: { category } }: CategoryPageProps) => {
  const postList = await getPostList(category)
  return (
    <section>
      <div>
        <ul>
          {postList.map((post) => (
            <li key={post.url + post.date}>
              <span>{post.date.toLocaleString()}</span>
              <Link href={post.url} className="text-primary">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default CategoryPage
