// import Image from 'next/image'
import { Post } from '@/types/post'
import { Black_Han_Sans } from 'next/font/google'

type PostHeaderProps = {
  post: Post
}

const blackHanSans = Black_Han_Sans({
  weight: ['400'],
  subsets: ['latin'],
})

export const PostHeader = ({ post }: PostHeaderProps) => {
  return (
    <div className="mt-24 mb-12 pb-6 border-b border-secondary-foreground">
      <h1 style={{ fontSize: '1.6rem' }} className="mb-4">
        {post.title}
      </h1>
      <div className="flex-row pb-0" style={{ fontSize: '1.4rem' }}>
        <span>{post.readingMinutes} min read</span>
        <span className="text-bold"> · </span>
        <span>{post.dateString}</span>
      </div>
      {/* <div className="col-span-4 border-2 border-slate-800 bg-transparent">
        <h1
          className={`text-[#efeae1] bg-black p-4 text-xl font-bold`}
          style={{
            color: 'white',
            textShadow:
              '-1px -1px 0 #0c0c0c,  1px -1px#0c0c0c, -1px 1px#0c0c0c, 1px 1px 0 #0c0c0c',
          }}
        >
          {post.title}
        </h1>
        <div className="flex-row p-2 pb-0">
          <span>{post.readingMinutes} min read</span>
          <span className="text-bold"> · </span>
          <span>{post.dateString}</span>
        </div>
        <p className="p-2 pt-1">{post.desc}</p>
      </div>
      <div className="col-span-1 border-2 border-slate-800 bg-[#dca89d] p-1.5">
        <div className="bg-[#e3cc71] h-full double-border p-4 text-3xl">
          <div className="text-lg">category:</div>
          <div>{post.category}</div>
        </div>
      </div> */}
    </div>
  )
}

export default PostHeader
