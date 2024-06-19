import { visit } from 'unist-util-visit'

export const rehypeRawPlugin = () => {
  return (tree: any) => {
    visit(tree, (node) => {
      if (node?.type === 'element' && node?.tagName === 'pre') {
        const [codeEl] = node.children
        if (codeEl.tagName !== 'code') return
        node.raw = codeEl.children?.[0].value
      }
    })
  }
}

export const rehypeAddRawToPrePlugin = () => {
  return (tree: any) => {
    visit(tree, (node) => {
      if (node?.type === 'element' && node?.tagName === 'figure') {
        // 예제에서는 -code-fragment 여서 계속 raw가 할당되지 않았음
        if (!('data-rehype-pretty-code-figure' in node.properties)) {
          return
        }
        for (const child of node.children) {
          if (child.tagName === 'pre') {
            child.properties['raw'] = node.raw
          }
        }
      }
    })
  }
}
