import { PixelIcon } from './PixelIcon.component'

const SUN_BITMAP = [
  '000001100000',
  '010000000010',
  '000000000000',
  '000011110000',
  '000111111000',
  '100111111001',
  '100111111001',
  '000111111000',
  '000011110000',
  '000000000000',
  '010000000010',
  '000001100000',
]

interface PixelSunIconProps {
  class?: string
}

export function PixelSunIcon({ class: className }: PixelSunIconProps) {
  return <PixelIcon bitmap={SUN_BITMAP} class={className} />
}
