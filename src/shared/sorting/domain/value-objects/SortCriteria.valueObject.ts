export type SortDirection = 'asc' | 'desc'

export class SortCriteria<Field extends string> {
  private constructor(
    public readonly field: Field | null,
    public readonly direction: SortDirection,
  ) {}

  static create<Field extends string>(field: Field, direction: SortDirection = 'asc'): SortCriteria<Field> {
    return new SortCriteria(field, direction)
  }

  static none<Field extends string>(): SortCriteria<Field> {
    return new SortCriteria<Field>(null, 'asc')
  }

  get isEmpty(): boolean {
    return this.field === null
  }

  toggled(field: Field): SortCriteria<Field> {
    if (this.field !== field) {
      return SortCriteria.create(field, 'asc')
    }
    return SortCriteria.create(field, this.direction === 'asc' ? 'desc' : 'asc')
  }

  equals(other: SortCriteria<Field>): boolean {
    return this.field === other.field && this.direction === other.direction
  }
}
