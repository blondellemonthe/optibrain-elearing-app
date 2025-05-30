'use client'
import {createContext, useContext, useState, useEffect, ReactNode} from 'react'
import {auth} from '@/app/lib/firebaseConfig'
import {onAuthStateChanged, User} from 'firebase/auth'

interface UserContextType {
    user: User | null
    userData: { uid: string; email?: string; displayName?: string } | null
    loading: boolean
    setUserData: (data: { uid: string; email?: string; displayName?: string } | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [userData, setUserData] = useState<{ uid: string; email?: string; displayName?: string } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            if (currentUser) {
                const storedData = localStorage.getItem('userData')
                if (storedData) {
                    setUserData(JSON.parse(storedData))
                } else {
                    const newUserData = {
                        uid: currentUser.uid,
                        email: currentUser.email,
                        displayName: currentUser.displayName,
                    }
                    setUserData(newUserData)
                    localStorage.setItem('userData', JSON.stringify(newUserData))
                }
            } else {
                setUserData(null)
                localStorage.removeItem('userData')
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return (
        <UserContext.Provider value={{user, userData, loading, setUserData}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}