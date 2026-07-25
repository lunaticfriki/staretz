import { DomainError } from '../../../../shared/errors/domain/Domain.error'

export class MissingPostImageError extends DomainError {
  constructor() {
    super("Selecciona una imatge per a l'article.")
  }
}
