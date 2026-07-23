import { PixelIcon } from './PixelIcon.component'

const MOON_BITMAP = [
  '000000000000',
  '000001100000',
  '000111000000',
  '001110000000',
  '001110000000',
  '011100000000',
  '011100000000',
  '001110000000',
  '001110000000',
  '000111000000',
  '000001100000',
  '000000000000',
]

interface PixelMoonIconProps {
  class?: string
}

export function PixelMoonIcon({ class: className }: PixelMoonIconProps) {
  return <PixelIcon bitmap={MOON_BITMAP} class={className} />
}
