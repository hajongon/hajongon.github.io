export const QuarterCircle = () => {
  return (
    <svg className="circle-text" viewBox="0 0 200 200">
      <circle cx="150" cy="150" r="150" className="circle" />

      {/* 
        M 150, 30 
        : 반지름 120 을 기준으로 한 시작점
        
        A 120,120 0 1,1 149.99, 30
        : 반지름 120 으로 원형 호를 그림

        0
        : x축 회전 각도
        1
        : Large-arc-flag (0: 작은 호, 1: 큰 호)
        1
        : Sweep-flag (0: 시계 방향, 1: 반시계 방향)

        149.99, 30
        : 끝점
      */}
      <path
        id="textPath"
        d="M 150, 50
   A 100,100 0 1,1 149.99, 50"
      />

      <text fontSize="32">
        <textPath href="#textPath" startOffset="75%">
          hajongon
        </textPath>
      </text>
    </svg>
  )
}
