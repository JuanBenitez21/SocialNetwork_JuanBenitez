import { User } from "@/types/common.type";
import { createContext, useState } from "react";
 
interface AuthContextProps {
    user: User | null,
    login: (email: string, password: string) => boolean,
    register: (user: User, password: string) => void
}
 
export const AuthContext = createContext({} as AuthContextProps);
 
const fakeDataSource = {
    users: [
        {
            email: "test@test.com",
            username: "test",
            name: "test",
            lastName: "test",
            age: 23
        },
    ],
    passwords: [
        {
            email: "test@test.com",
            password: "12345678"
        }
    ]
}
 
export const AuthProvider = ({ children }: any) => {
 
    // varibles
    // USER -> { email:string, password:string, name:string}
    const [user, setUser] = useState(null as any);
 
    // funciones
 
    const login = (email: string, password: string) => {
        const userExist = fakeDataSource
            .passwords
            .find(value => value.email == email &&
                value.password == password)
        if (userExist) {
            setUser(userExist)
            return true
        }
        return false
    }
 
    const register = (user: User, password: string) => {
 
    }
    return <AuthContext.Provider
        value={{
            user,
            login,
            register,
        }}
    >
        {children}
    </AuthContext.Provider>
 
}