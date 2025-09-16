import { User } from "@/types/common.type";
import { supabase } from "@/utils/supabase";
import { createContext, useState } from "react";
 
interface AuthContextProps {
    user: User | null,
    login: (email: string, password: string) => Promise<boolean>,
    register: (user: User, password: string) => Promise<boolean>,
    updateProfile: (profileData: Partial<User>) => Promise<boolean>,
    setUser: (user: User | null) => void
}
 
export const AuthContext = createContext({} as AuthContextProps);
 
 
export const AuthProvider = ({ children }: any) => {
 
    // varibles
    // USER -> { email:string, password:string, name:string}
    const [user, setUser] = useState(null as any);
 
    // funciones
 
    const login = async (email: string, password: string) => {
        try {
            // Authenticate with Supabase Auth
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                console.error('Login error:', error.message);
                return false;
            }

            if (data.user) {
                // Fetch complete user profile from profiles table
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                if (profileError) {
                    console.error('Profile fetch error:', profileError.message);
                    // Fallback: use basic auth data if profile fetch fails
                    setUser({
                        id: data.user.id,
                        email: data.user.email!,
                        name: data.user.user_metadata.name || data.user.email!.split('@')[0]
                    });
                } else {
                    // Set complete profile data
                    setUser(profileData);
                }

                return true;
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }
 
    const register = async (user: User, password: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: user.email,
                password,
                options: {
                    data: {
                        name: user.name
                    }
                }
            });

            if (error) {
                console.error('Registration error:', error.message);
                throw new Error(error.message);
            }

            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        email: user.email,
                        name: user.name,
                        username: user.email.split('@')[0]
                    });

                if (profileError) {
                    console.error('Profile creation error:', profileError.message);
                    throw new Error(`Error creando perfil: ${profileError.message}`);
                }

                setUser({
                    id: data.user.id,
                    email: data.user.email!,
                    name: user.name
                });
                return true;
            }

            return false;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    }

    const updateProfile = async (profileData: Partial<User>) => {
        if (!user?.id) {
            console.error('No user ID available');
            return false;
        }

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    ...profileData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) {
                console.error('Update profile error:', error.message);
                throw new Error(error.message);
            }

            setUser({
                ...user,
                ...profileData
            });

            return true;
        } catch (error) {
            console.error('Update profile error:', error);
            return false;
        }
    };
    return <AuthContext.Provider
        value={{
            user,
            login,
            register,
            updateProfile,
            setUser,
        }}
    >
        {children}
    </AuthContext.Provider>
 
}