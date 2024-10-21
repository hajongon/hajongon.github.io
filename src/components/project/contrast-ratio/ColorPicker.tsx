import { useState, useEffect, ChangeEvent } from 'react'
import './ColorPicker.css'

// HEX 값을 HSL로 변환하는 함수
function hexToHsl(hex: string): [number, number, number] {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h * 360, s * 100, l * 100] // 반환값 HSL (0-360, 0-100, 0-100)
}

// HSL을 HEX로 변환하는 함수
function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0,
    g = 0,
    b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function hexToRgb(hex: any) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (m: any, r: any, g: any, b: any) {
    return r + r + g + g + b + b
  })

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function luminance(r: any, g: any, b: any) {
  var a = [r, g, b].map(function (v) {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

// 대비 비율 계산 함수
function getContrastRatio(color1: string, color2: string): string {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (rgb1 === null || rgb2 === null) {
    return 'Invalid color value'
  }
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b)

  const ratio =
    lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05)

  // show results depending on WCAG requirements

  return ratio.toFixed(1)
}

export default function ColorPicker(): JSX.Element {
  const [textColor, setTextColor] = useState<string>('#000000')
  const [bgColor, setBgColor] = useState<string>('#ffffff')

  const [textLuminance, setTextLuminance] = useState<number>(
    hexToHsl(textColor)[2],
  )
  const [bgLuminance, setBgLuminance] = useState<number>(hexToHsl(bgColor)[2])

  const [textLuminanceMax, setTextLuminanceMax] = useState<number>(
    hexToHsl(textColor)[2],
  )
  const [bgLuminanceMax, setBgLuminanceMax] = useState<number>(
    hexToHsl(bgColor)[2],
  )

  const [contrastResults, setContrastResults] = useState({
    largeTextAA: '',
    smallTextAA: '',
    graphicAA: '',
    largeTextAAA: '',
    smallTextAAA: '',
    graphicAAA: '',
  })

  // 텍스트 색상 명도 변경 핸들러
  const handleTextLuminanceChange = (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    const newLuminance = Number(e.target.value)
    const [h, s] = hexToHsl(textColor)
    setTextLuminance(newLuminance)
    setTextColor(hslToHex(h, s, newLuminance))
  }

  // 배경 색상 명도 변경 핸들러
  const handleBgLuminanceChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newLuminance = Number(e.target.value)
    const [h, s] = hexToHsl(bgColor)
    setBgLuminance(newLuminance)
    setBgColor(hslToHex(h, s, newLuminance))
  }

  // 슬라이더 핸들의 left 위치 계산
  const getSliderHandlePosition = (luminance: number, max: number): string => {
    return `${(luminance / max) * 100}%`
  }

  const [contrastRatio, setContrastRatio] = useState('')
  const [textColorBarBG, setTextColorBarBG] = useState('')
  const [bgColorBarBG, setBgColorBarBG] = useState('')

  useEffect(() => {
    const ratio = getContrastRatio(textColor, bgColor)
    setContrastRatio(ratio)

    setContrastResults((prev) => ({
      ...prev,
      largeTextAA: +ratio > 3 ? 'PASS' : 'FAIL',
      smallTextAA: +ratio > 4.5 ? 'PASS' : 'FAIL',
      graphicAA: +ratio > 3 ? 'PASS' : 'FAIL',
      largeTextAAA: +ratio > 4.5 ? 'PASS' : 'FAIL',
      smallTextAAA: +ratio > 7 ? 'PASS' : 'FAIL',
      graphicAAA: +ratio > 4.5 ? 'PASS' : 'FAIL',
    }))

    // The background gradients for the sliders can remain as before
    setTextColorBarBG(`linear-gradient(to right, #000000, 20%, ${textColor})`)
    setBgColorBarBG(`linear-gradient(to right, #000000, 20%, ${bgColor})`)
  }, [textColor, bgColor])

  const [contrastSelection, setContrastSelection] = useState<'AA' | 'AAA'>('AA') // New state for contrast selection

  return (
    <div>
      {/* AA/AAA Selection */}
      <div className="mt-12 mb-4">WCAG 2.1 Level</div>
      <div className="mb-4 flex justify-content-start gap-x-4">
        <label className="flex justify-content-center gap-x-2">
          <input
            type="radio"
            value="AA"
            checked={contrastSelection === 'AA'}
            onChange={() => setContrastSelection('AA')}
          />
          AA
        </label>

        <label className="flex justify-content-center gap-x-2">
          <input
            type="radio"
            value="AAA"
            checked={contrastSelection === 'AAA'}
            onChange={() => setContrastSelection('AAA')}
          />
          AAA
        </label>
      </div>

      <div className="grid grid-cols-12 mt-12 mb-12 gap-x-6">
        <div className="col-span-6 color-select-box">
          <div className="mb-4">Text Color</div>
          {/* 텍스트 색상 선택 */}
          <input
            className="textColor"
            type="color"
            value={textColor}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setTextColor(e.target.value)
              const luminance = hexToHsl(e.target.value)[2]
              setTextLuminance(luminance) // 색상 선택 시 명도 업데이트
              setTextLuminanceMax(luminance) // 선택한 명도 값을 max로 설정
            }}
          />
          {/* 텍스트 명도 슬라이더 */}
          <div className="p-4">
            <div
              className="spectrum-Slider-controls w-full relative h-6 rounded-full"
              style={{
                background: textColorBarBG,
              }}
            >
              <div
                className="spectrum-Slider-handle absolute w-4 h-8 bg-blue-500"
                style={{
                  top: '-6px',
                  left: getSliderHandlePosition(
                    textLuminance,
                    textLuminanceMax,
                  ),
                  transform: 'translateX(-50%)',
                  backgroundColor: textColor,
                }}
              ></div>
              <div className="w-full">
                <label></label>
                <input
                  className="luminanceSelector w-full "
                  type="range"
                  min="1"
                  max={textLuminanceMax}
                  value={textLuminance}
                  onChange={handleTextLuminanceChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-6 color-select-box">
          <div className="mb-4">Background Color</div>
          {/* 배경 색상 선택 */}
          <input
            className="bgColor"
            type="color"
            value={bgColor}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setBgColor(e.target.value)
              const luminance = hexToHsl(e.target.value)[2]
              setBgLuminance(luminance) // 색상 선택 시 명도 업데이트
              setBgLuminanceMax(luminance) // 선택한 명도 값을 max로 설정
            }}
          />

          {/* 배경 명도 슬라이더 */}
          <div className="p-4">
            <div
              className="spectrum-Slider-controls w-full relative h-6 bg-gray-200 rounded-full"
              style={{
                background: bgColorBarBG,
              }}
            >
              <div
                className="spectrum-Slider-handle absolute w-4 h-8 bg-blue-500"
                style={{
                  top: '-6px',
                  left: getSliderHandlePosition(bgLuminance, bgLuminanceMax),
                  transform: 'translateX(-50%)',
                  backgroundColor: bgColor,
                }}
              ></div>
              <div className="w-full">
                <label></label>
                <input
                  className="luminanceSelector w-full"
                  type="range"
                  min="1"
                  max={bgLuminanceMax}
                  value={bgLuminance}
                  onChange={handleBgLuminanceChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 대비 비율 출력 */}
      <div className="contrast-ratio mb-12">
        <p>명암비 {contrastRatio} : 1</p>
      </div>

      {/* 미리보기 */}
      <div className="mb-12">
        {/* <div className="mb-4">Preview</div> */}
        <div
          className="grid preview grid-cols-12 mb-4 gap-x-6"
          //   style={{ fontSize: '1.2rem' }}
        >
          <div className="text col-span-4">일반 텍스트</div>
          <div className="text col-span-4">대형 텍스트</div>
          <div className="text col-span-4">그래픽 구성 요소</div>
        </div>
        <div className="grid preview grid-cols-12 mb-4 gap-x-6">
          <div
            className="text col-span-4 flex flex-col p-8"
            style={{ color: textColor, backgroundColor: bgColor }}
          >
            <span>적절한 대비를 통해 </span>
            <span>가독성을 높여주세요.</span>
          </div>
          <div
            className="text col-span-4 flex flex-col p-8"
            style={{ color: textColor, backgroundColor: bgColor }}
          >
            <span>적절한 대비를 통해 </span>
            <span>가독성을 높여주세요.</span>
          </div>
          <div
            className="text col-span-4 flex flex-col p-8"
            style={{ color: textColor, backgroundColor: bgColor }}
          >
            <span>적절한 대비를 통해 </span>
            <span>가독성을 높여주세요.</span>
          </div>
        </div>
        <div className="grid preview grid-cols-12 gap-x-6">
          <div className="text col-span-4 text-end">
            {contrastSelection === 'AA'
              ? contrastResults.smallTextAA
              : contrastResults.smallTextAAA}
          </div>
          <div className="text col-span-4 text-end">
            {contrastSelection === 'AA'
              ? contrastResults.largeTextAA
              : contrastResults.largeTextAAA}
          </div>
          <div className="text col-span-4 text-end">
            {contrastSelection === 'AA'
              ? contrastResults.graphicAA
              : contrastResults.graphicAAA}
          </div>
        </div>
      </div>
    </div>
  )
}
