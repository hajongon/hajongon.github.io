import { MDXRemote } from 'next-mdx-remote/rsc'
import { MdxComponents } from '../../mdx'
import remarkA11yEmoji from '@fec/remark-a11y-emoji'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import { Post } from '../../../types/post'

type PostBodyProps = {
  post: Post
}

export const PostBody = ({ post }: PostBodyProps) => {
  return (
    <>
      <div className="mdx">
        <MDXRemote
          source={post.content}
          components={MdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkA11yEmoji, remarkBreaks],
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  {
                    theme: 'github-light-default',
                    keepBackground: true,
                  },
                ],
                rehypeSlug,
              ],
            },
          }}
        />
      </div>
    </>
  )
}

export default PostBody
