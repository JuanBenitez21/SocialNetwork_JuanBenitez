// contexts/DataContext.tsx
import { supabase } from "@/utils/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

interface DataContextProps {
    chats: any[],
    getUsers: () => Promise<any[]>,
    getChats: () => Promise<any[]>,
    getSingleChat: (id: string) => any,
    createChat: (userId: string) => Promise<any>
}

export const DataContext = createContext({} as DataContextProps);

export const DataProvider = ({ children }: any) => {

    const [chats, setChats] = useState<any[]>([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            getChats();
        }
    }, [user]);

    const getUsers = async () => {
        try {
            const { data, error } = await supabase.from("profiles").select("*");
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.log(error)
            return []
        }
    }

    const getChats = async () => {
        try {
            const { data, error } = await supabase
                .from("chats")
                .select("*, user1:profiles!user_id_1(*), user2:profiles!user_id_2(*), messages(*)")
                .or(`user_id_1.eq.${user?.id},user_id_2.eq.${user?.id}`);

            if (error) throw error;

            if (data) {
                setChats(data);
                return data
            }
        } catch (error) {
            console.log(error)
        }
        return []
    }

    const getSingleChat = (id: string) => {
        return chats.find(value => value.id == id)
    }

    const createChat = async (userId: string) => {
        try {
            const { data, error } = await supabase.from('chats').insert([
                { user_id_1: user?.id, user_id_2: userId }
            ]).select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.log(error);
        }
    }

    return <DataContext.Provider
        value={{
            chats,
            getUsers,
            getChats,
            getSingleChat,
            createChat
        }}
    >
        {children}
    </DataContext.Provider>
}