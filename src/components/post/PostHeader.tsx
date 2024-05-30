import Image from 'next/image'
import { Post } from '../../../types/post'

type PostHeaderProps = {
  post: Post
}

export const PostHeader = ({ post }: PostHeaderProps) => {
  return (
    <header>
      <h1>{post.title}</h1>
      <p>{post.dateString}</p>
      <p>{post.readingMinutes}분 읽기</p>
      <p>{post.desc}</p>

      <Image src={post.thumbnail} alt="Thumbnail" width={400} height={300} />
    </header>
  )
}

export default PostHeader
