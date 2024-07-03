import { getPostList, getCategoryList } from '@/lib/post'
import Image from 'next/image'
import Link from 'next/link'

// deploy test
export default async function List() {
  const categoryList = await getCategoryList()
  const postList = await getPostList()

  const postsCount = async (category: string) => {
    const postList = await getPostList(category)
    let postfix = 'posts'
    return postList.length > 1
      ? postList.length + ' ' + postfix
      : postList.length + ' ' + postfix.slice(0, -1)
  }

  // 최신 포스트를 날짜 순으로 정렬
  const sortedPostList = postList.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const [latestPost, secondLatestPost, thirdLatestPost] = sortedPostList.slice(
    0,
    3,
  )

  return (
    <>
      <div className="vintage-horizontal-line m-4"></div>
      <section className="w-full">
        <div className="space-y-4 mb-4 w-full">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="latest-posts sm:col-span-2 border border-slate-600 p-4">
              <Link href={latestPost.url}>
                <Image
                  className="grayscale-image w-full mb-4 border border-slate-400"
                  src={latestPost.thumbnail || '/posts/bee_thumbnail.jpg'}
                  width={300}
                  height={300}
                  alt="latest post thumbnail"
                />
                <div className="text-2xl mb-4">
                  [{latestPost.category}] {latestPost.title}
                </div>
              </Link>
            </div>

            <div className="latest-posts sm:col-span-1 grid grid-rows-4 gap-4">
              <div className="row-span-3 vintage-border p-4 w-full">
                <Link href={secondLatestPost.url}>
                  <Image
                    className="grayscale-image mb-4 w-full border border-slate-400"
                    src={
                      secondLatestPost.thumbnail || '/posts/bee_thumbnail.jpg'
                    }
                    width={100}
                    height={100}
                    alt="second latest post thumbnail"
                  />
                  <div className="text-xl">
                    [{secondLatestPost.category}] {secondLatestPost.title}
                  </div>
                </Link>
              </div>
              <div className="vintage-border row-span-1 p-4">
                <Link href={thirdLatestPost.url}>
                  {/* <Image
                    className="grayscale-image w-full mb-4"
                    src={thirdLatestPost.thumbnail}
                    width={150}
                    height={150}
                    alt="third latest post thumbnail"
                  /> */}
                  <div className="text-xl mb-4">
                    [{thirdLatestPost.category}] {thirdLatestPost.title}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-10 gap-4">
          <ul className="md:col-span-5 vintage-border pl-4 pr-4 pt-8 pb-8">
            {categoryList.map(async (category, i) => (
              <li key={`${i}` + `${category}`}>
                <Link
                  href={`/blog/${category}`}
                  className="category-link grid grid-cols-10 gap-4"
                >
                  <span className="col-span-5">{category}</span>
                  <span className="col-span-1">···</span>
                  <span className="col-span-4 text-end">
                    {await postsCount(category)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="md:col-span-5 vintage-border pl-4 pr-4 pt-8 pb-8">
            <div className="grid grid-cols-3 gap-4">
              <div className={`col-span-1 p-4 text-2xl`}>
                <div className="mb-4">Front-end</div>
                <div className="sm:text-sm md:text-xl mb-2">91. 11. 29</div>
                <div className="sm:text-sm md:text-xl">Seoul, Korea</div>
              </div>
              <div className="col-span-2 p-4">
                <Image
                  className="grayscale-image"
                  src="/img/character-1.png"
                  width={300}
                  height={300}
                  alt="character"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="vintage-horizontal-line m-4"></div>
    </>
  )
}
