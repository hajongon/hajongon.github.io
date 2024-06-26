import dynamic from 'next/dynamic'
import { Callout } from './Callout'
import { Image } from './Image'
import { Pre } from './codeblock/Pre'

const DynamicImage = dynamic(() => import('next/image'), { ssr: false })

const CustomImage = (props: any) => (
  <DynamicImage
    {...props}
    width={props.width || 800} // 기본값을 지정하거나 props에서 가져오기
    height={props.height || 800} // 기본값을 지정하거나 props에서 가져오기
    alt={props.alt || ''}
  />
)

export type TOCSubSection = {
  slug: string
  text: string
}

/** table-of-content */
export type TOCSection = TOCSubSection & {
  subSections: TOCSubSection[]
}

export const parseToc = (source: string) => {
  return source
    .split('\n')
    .filter((line) => line.match(/(^#{1,3})\s/))
    .reduce<TOCSection[]>((ac, rawHeading) => {
      const nac = [...ac]
      const removeMdx = rawHeading
        .replace(/^##*\s/, '')
        .replace(/[\*,\~]{2,}/g, '')
        .replace(/(?<=\])\((.*?)\)/g, '')
        .replace(/(?<!\S)((http)(s?):\/\/|www\.).+?(?=\s)/g, '')

      const section = {
        slug: removeMdx
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣 -]/g, '')
          .replace(/\s/g, '-'),
        text: removeMdx,
      }

      const isSubTitle = rawHeading.split('#').length - 1 === 3

      if (ac.length && isSubTitle) {
        nac.at(-1)?.subSections.push(section)
      } else {
        nac.push({ ...section, subSections: [] })
      }

      return nac
    }, [])
}

export const MdxComponents = {
  // a: ExternalLink as any,
  img: Image as any,
  h1: (props: any) => (
    <h1
      style={{
        fontSize: '1.6rem',
        fontWeight: 'bold',
        marginBottom: '0.8rem',
      }}
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      style={{
        fontSize: '1.6rem',
        fontWeight: 'bolder',
        marginBottom: '0.8rem',
      }}
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3 style={{ fontSize: '1.6rem', marginBottom: '0.8rem' }} {...props} />
  ),

  h4: (props: any) => (
    <h4
      style={{
        fontSize: '1.6rem',
        fontWeight: 'bolder',
        marginBottom: '0.8rem',
      }}
      {...props}
    />
  ),

  p: (props: any) => (
    <p
      style={{ fontSize: '1.6rem', marginBottom: '0.8rem' }}
      className="text-slate-600"
      {...props}
    />
  ),
  blockquote: Callout,
  Callout,
  pre: Pre as any,
}
