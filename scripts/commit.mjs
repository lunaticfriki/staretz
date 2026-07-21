import { execSync } from 'node:child_process'
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

function hasStagedChanges() {
  try {
    execSync('git diff --cached --quiet')
    return false
  } catch {
    return true
  }
}

async function main() {
  if (!hasStagedChanges()) {
    console.error('No staged changes. Stage files with "git add" before committing.')
    process.exit(1)
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout })

  console.log('Select the type of change:')
  TYPES.forEach(([type, description], index) => {
    console.log(`  ${index + 1}) ${type} - ${description}`)
  })

  const typeAnswer = await rl.question('Type (number): ')
  const selected = TYPES[Number.parseInt(typeAnswer, 10) - 1]

  if (!selected) {
    console.error('Invalid selection.')
    rl.close()
    process.exit(1)
  }

  const scope = await rl.question('Scope (optional, press enter to skip): ')
  const description = await rl.question('Short description: ')

  rl.close()

  if (!description.trim()) {
    console.error('Description cannot be empty.')
    process.exit(1)
  }

  const [type] = selected
  const header = scope.trim() ? `${type}(${scope.trim()}): ${description.trim()}` : `${type}: ${description.trim()}`

  execSync(`git commit -m ${JSON.stringify(header)}`, { stdio: 'inherit' })
}

main()
