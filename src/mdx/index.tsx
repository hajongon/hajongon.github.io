import Image from 'next/image'

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
        fontSize: '1rem',
        fontWeight: 'bold',
        marginBottom: '0.8rem',
      }}
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.8rem' }}
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3 style={{ fontSize: '1rem', marginBottom: '0.8rem' }} {...props} />
  ),

  p: (props: any) => (
    <p
      style={{ fontSize: '1rem', marginBottom: '0.8rem' }}
      className="text-slate-600"
      {...props}
    />
  ),
  // blockquote: Callout,
  // Callout,
}
