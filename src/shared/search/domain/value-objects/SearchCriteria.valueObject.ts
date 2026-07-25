export class SearchCriteria {
  private constructor(public readonly term: string) {}

  static create(term: string): SearchCriteria {
    return new SearchCriteria(term.trim())
  }

  static empty(): SearchCriteria {
    return new SearchCriteria('')
  }

  get isEmpty(): boolean {
    return this.term.length === 0
  }

  matches(candidate: string): boolean {
    if (this.isEmpty) {
      return true
    }
    return candidate.toLowerCase().includes(this.term.toLowerCase())
  }

  equals(other: SearchCriteria): boolean {
    return this.term.toLowerCase() === other.term.toLowerCase()
  }

  toString(): string {
    return this.term
  }
}
