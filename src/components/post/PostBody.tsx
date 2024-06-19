import { MDXRemote } from 'next-mdx-remote/rsc'
import { MdxComponents } from '../../mdx'
import remarkA11yEmoji from '@fec/remark-a11y-emoji'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { Post } from '../../../types/post'
import { rehypeAddRawToPrePlugin, rehypeRawPlugin } from '../../plugins/rehype'

type PostBodyProps = {
  post: Post
}

export const PostBody = ({ post }: PostBodyProps) => {
  return (
    <div className="mdx prose">
      <MDXRemote
        source={post.content}
        components={MdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkA11yEmoji, remarkBreaks],
            rehypePlugins: [
              rehypeRawPlugin,
              [
                rehypePrettyCode,
                {
                  theme: 'github-light-default',
                  keepBackground: true,
                },
              ],
              rehypeSlug,
              rehypeAddRawToPrePlugin,
            ],
          },
        }}
      />
    </div>
  )
}

export default PostBody
