import { PixelIcon } from './PixelIcon.component'

const SEARCH_BITMAP = [
  '000000000000',
  '001111000000',
  '011000100000',
  '110000010000',
  '100000010000',
  '100000010000',
  '110000010000',
  '011000100000',
  '001111110000',
  '000000011100',
  '000000001110',
  '000000000110',
]

interface PixelSearchIconProps {
  class?: string
}

export function PixelSearchIcon({ class: className }: PixelSearchIconProps) {
  return <PixelIcon bitmap={SEARCH_BITMAP} class={className} />
}
