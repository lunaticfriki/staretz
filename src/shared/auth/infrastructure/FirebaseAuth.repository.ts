import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { AuthUser } from '../domain/value-objects/AuthUser.valueObject'
import { AuthRepository } from '../domain/repositories/Auth.repository'
import { auth } from '../../firebase/auth'

export class FirebaseAuthRepository extends AuthRepository {
  async login(email: string, password: string): Promise<AuthUser> {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return AuthUser.create(credential.user.uid, credential.user.email ?? email)
  }

  async logout(): Promise<void> {
    await signOut(auth)
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      callback(firebaseUser ? AuthUser.create(firebaseUser.uid, firebaseUser.email ?? '') : null)
    })
  }
}
