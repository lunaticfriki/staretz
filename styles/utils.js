import { css } from '@emotion/react'

const colors = css`
  --main_black: #000;
  --main_white: #fff;
  --main_gray: #bdb9bb;
  --main_yellow: #d7ff5f;
  --main_pink: #db1d5d;
  --main_green: #288a6e;
  --main_dark_blue: #130f18;
  --secondary_white: #f4f4f4;
  --main_blur: rgba(0, 0, 0, 0.6);
`

const sizes = {
  sm: '500px',
  md: '769px',
  lg: '972px',
  xl: '1200px',
}

const device = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}) {
      ${css(...args)};
    }
  `
  return acc
}, {})

const rem = (pixelQuantity, defaultQuantity = 16) =>
  `${pixelQuantity / defaultQuantity}rem`

export { colors, sizes, device, rem }
