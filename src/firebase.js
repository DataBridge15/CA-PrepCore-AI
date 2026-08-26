import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyAbtj-pPTizdRY5v1Ze_dJUgk7rRinmz50',
  authDomain: 'ca-prepcore-ai.firebaseapp.com',
  databaseURL:
    'https://ca-prepcore-ai-default-rtdb.firebaseio.com',
  projectId: 'ca-prepcore-ai',
  storageBucket: 'ca-prepcore-ai.firebasestorage.app',
  messagingSenderId: '1006375746054',
  appId: '1:1006375746054:web:9a8b23a618ef5f6a346187',
  measurementId: 'G-Q05JQZJPMH',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const database = getDatabase(app)

export default app