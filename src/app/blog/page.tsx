import { Button } from '@/components/ui/button'
import { getPostList } from '@/lib/post'
import Image from 'next/image'

export default async function List({ category }) {
    const postList = await getPostList(category)

    return (
        <section>
            <Image
                src="/img/friends.webp"
                alt="friends"
                width={1792 / 4}
                height={1024 / 4}
            />
            <div>
                <h1>Post List</h1>
                <ul>
                    {postList.map((post) => (
                        <li key={post.url + post.date}>
                            <h2 className="text-xl font-bold">{post.title}</h2>
                        </li>
                    ))}
                </ul>
                <Button>click me</Button>
            </div>
        </section>
    )
}
