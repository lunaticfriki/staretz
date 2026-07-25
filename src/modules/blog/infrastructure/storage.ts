import { getStorage } from 'firebase/storage'
import { firebaseApp } from '../../../shared/firebase/firebaseApp'

export const storage = getStorage(firebaseApp)
