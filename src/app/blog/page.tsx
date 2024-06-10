import { getPostList, getCategoryList } from '@/lib/post'
import Image from 'next/image'
import Link from 'next/link'

// deploy test
export default async function List() {
  const categoryList = await getCategoryList()

  const postsCount = async (category: string) => {
    const postList = await getPostList(category)
    let postfix = 'posts'
    return postList.length > 1
      ? postList.length + ' ' + postfix
      : postList.length + ' ' + postfix.slice(0, -1)
  }

  const getStringLength = (str: string) => {
    let length = 0
    for (let char of str) {
      length += char.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/) ? 2 : 1
    }
    return length
  }

  const generateDots = (category: string, maxLength: number) => {
    const categoryLength = getStringLength(category)
    const dotsLength = Math.floor(maxLength - categoryLength / 2 + 5)
    return '·'.repeat(dotsLength > 0 ? dotsLength : 0)
  }

  const maxCategoryLength = Math.max(
    ...categoryList.map((category) => getStringLength(category)),
  )

  return (
    <>
      <div className="vintage-horizontal-line m-4"></div>
      <section>
        <div className="grid md:grid-cols-10 gap-4">
          <ul className="md:col-span-4 vintage-border pl-4 pr-4 pt-8 pb-8">
            {categoryList.map((category, i) => (
              <li key={`${i}` + `${category}`}>
                <Link href={`/blog/${category}`} className="category-link">
                  <span>{category}</span>
                  <span>{generateDots(category, maxCategoryLength)}</span>
                  <span>{postsCount(category)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="md:col-span-6 vintage-border-2 pl-4 pr-4 pt-8 pb-8">
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
