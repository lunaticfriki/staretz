export interface ParsedMarkdown {
  frontmatter: Record<string, string>
  body: string
}

export function parseMarkdownWithFrontmatter(raw: string): ParsedMarkdown {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)

  if (!match) {
    return { frontmatter: {}, body: raw.trim() }
  }

  const [, frontmatterBlock, body] = match
  const frontmatter: Record<string, string> = {}

  frontmatterBlock.split('\n').forEach((line) => {
    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1) {
      return
    }
    const key = line.slice(0, separatorIndex).trim()
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, '')
    frontmatter[key] = value
  })

  return { frontmatter, body: body.trim() }
}
