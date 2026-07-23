import { writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'

const TYPES = [
  ['feat', 'a new feature'],
  ['fix', 'a bug fix'],
  ['docs', 'documentation only'],
  ['style', 'formatting, no code meaning change'],
  ['refactor', 'neither fixes a bug nor adds a feature'],
  ['perf', 'performance improvement'],
  ['test', 'adding or correcting tests'],
  ['build', 'build system or dependency changes'],
  ['ci', 'CI configuration changes'],
  ['chore', 'anything else'],
  ['revert', 'reverts a previous commit'],
]

const SKIP_SOURCES = new Set(['message', 'merge', 'squash', 'commit'])

async function main() {
  const [, , messageFile, source] = process.argv

  if (!messageFile) {
    process.exit(0)
  }

  if (source && SKIP_SOURCES.has(source)) {
    process.exit(0)
  }

  if (!process.stdin.isTTY) {
    process.exit(0)
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout })

  console.log('Select the type of change:')
  TYPES.forEach(([type, description], index) => {
    console.log(`  ${index + 1}) ${type} - ${description}`)
  })

  const typeAnswer = await rl.question('Type (number): ')
  const selected = TYPES[Number.parseInt(typeAnswer, 10) - 1]

  if (!selected) {
    console.error('Invalid selection. Commit aborted.')
    rl.close()
    process.exit(1)
  }

  const scope = await rl.question('Scope (optional, press enter to skip): ')
  const description = await rl.question('Short description: ')

  rl.close()

  if (!description.trim()) {
    console.error('Description cannot be empty. Commit aborted.')
    process.exit(1)
  }

  const [type] = selected
  const header = scope.trim() ? `${type}(${scope.trim()}): ${description.trim()}` : `${type}: ${description.trim()}`

  writeFileSync(messageFile, `${header}\n`)
}

main()
