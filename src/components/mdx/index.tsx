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
  let inCodeBlock = false

  return source
    .split('\n')
    .filter((line) => {
      if (line.match(/^```/)) {
        inCodeBlock = !inCodeBlock // 코드 블록의 시작과 끝을 토글
      }
      if (inCodeBlock) {
        return false // 코드 블록 내부의 라인은 제외
      }
      return line.match(/(^#{1,3})\s/) // 제목 라인만 포함
    })
    .reduce<TOCSection[]>((ac, rawHeading) => {
      const nac = [...ac]
      const removeMdx = rawHeading
        .replace(/^##*\s/, '')
        .replace(/[\*,\~]{2,}/g, '')
        .replace(/(?<=\])\((.*?)\)/g, '')
        .replace(/(?<!\S)((http)(s?):\/\/|www\.).+?(?=\s)/g, '')
        .trim()

      if (!removeMdx) return nac // 빈 제목은 제외

      const section = {
        slug: removeMdx
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
