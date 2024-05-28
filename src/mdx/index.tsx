// 커스텀 컴포넌트들
const Heading1 = (props: any) => <h1 style={{ color: 'red' }} {...props} />
const Paragraph = (props: any) => <p style={{ fontSize: '18px' }} {...props} />

// MdxComponents 객체 정의
export const MdxComponents = {
    h1: Heading1,
    p: Paragraph,
    // 필요에 따라 다른 컴포넌트도 추가 가능
}
