import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { firebaseApp } from './firebaseApp'

export const auth = getAuth(firebaseApp)

const emulatorHost = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST
if (emulatorHost) {
  connectAuthEmulator(auth, `http://${emulatorHost}`, { disableWarnings: true })
}
