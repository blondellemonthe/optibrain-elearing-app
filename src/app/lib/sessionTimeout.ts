import { signOut } from 'firebase/auth'
import { auth } from './firebaseConfig'

// Constants
const SESSION_DURATION_MS = 2 * 24 * 60 * 60 * 1000 // 2 days in milliseconds
const LOGIN_TIMESTAMP_KEY = 'loginTimestamp'

export const setLoginTimestamp = () => {
    const timestamp = Date.now()
    localStorage.setItem(LOGIN_TIMESTAMP_KEY, timestamp.toString())
}

export const checkSessionTimeout = async () => {
    const loginTimestamp = localStorage.getItem(LOGIN_TIMESTAMP_KEY)
    if (!loginTimestamp) return false

    const currentTime = Date.now()
    const timeElapsed = currentTime - parseInt(loginTimestamp, 10)

    if (timeElapsed > SESSION_DURATION_MS) {
        // Session expired, sign out the user
        await signOut(auth)
        localStorage.removeItem(LOGIN_TIMESTAMP_KEY)
        return true
    }
    return false
}

export const clearSession = () => {
    localStorage.removeItem(LOGIN_TIMESTAMP_KEY)
}