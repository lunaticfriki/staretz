import { getFirestore } from 'firebase/firestore/lite'
import { firebaseApp } from '../../../shared/firebase/firebaseApp'

export const firestore = getFirestore(firebaseApp)
