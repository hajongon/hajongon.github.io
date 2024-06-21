import { getCategoryList, getPostList } from '@/lib/post'
import Image from 'next/image'
import Link from 'next/link'

type CategoryPageProps = {
  params: {
    category: string
  }
}

export async function generateStaticParams() {
  const categories = await getCategoryList()
  return categories.map((category) => ({
    category,
  }))
}

const CategoryPage = async ({ params: { category } }: CategoryPageProps) => {
  const postList = await getPostList(category)
  return (
    <section>
      <div>
        <ul>
          {postList.map((post) => (
            <li key={post.url + post.date}>
              {/* <span>{post.date.toLocaleString()}</span>
              <Link href={post.url} className="text-primary">
                {post.title}
              </Link> */}
              <div className="vintage-border grid grid-cols-3 gap-4">
                <div className="col-span-2 grid grid-rows-5">
                  <div className="row-span-2 text-xl">
                    <Link href={post.url}>{post.title}</Link>
                  </div>
                  <div className="row-span-1 text-base">
                    {post.date.toLocaleString()}
                  </div>
                </div>
                <div className="col-span-1">
                  <Link href={post.url}>
                    <Image
                      className="grayscale-image w-full border border-slate-600"
                      src={post.thumbnail}
                      width={100}
                      height={100}
                      alt="second latest post thumbnail"
                    />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default CategoryPage
