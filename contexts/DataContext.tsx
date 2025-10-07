// juanbenitez21/socialnetwork_juanbenitez/SocialNetwork_JuanBenitez-testeodeFrente/contexts/DataContext.tsx

import { supabase } from "@/utils/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

interface DataContextProps {
    chats: any[],
    posts: any[], // <-- AÑADE ESTA LÍNEA
    getUsers: () => Promise<any[]>,
    getChats: () => Promise<any[]>,
    getSingleChat: (id: string) => any,
    createChat: (userId: string) => Promise<any>
    getPosts: () => Promise<any[]>, // <-- AÑADE ESTA LÍNEA
    createPost: (content: string, imageUrl: string) => Promise<any>, // <-- AÑADE ESTA LÍNEA
}

export const DataContext = createContext({} as DataContextProps);

export const DataProvider = ({ children }: any) => {

    const [chats, setChats] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]); // <-- AÑADE ESTA LÍNEA
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            getChats();
            getPosts(); // <-- AÑADE ESTA LÍNEA

            // Suscripción a nuevos mensajes para actualizar la lista de chats
            const messageChannel = supabase
                .channel('public:messages')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
                    (payload) => {
                        // Cuando llega un nuevo mensaje, volvemos a cargar los chats para reordenarlos
                        getChats();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(messageChannel);
            };
        }
    }, [user]);

    const getUsers = async () => {
        try {
            // Excluimos al usuario actual de la lista
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .neq('id', user?.id);
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
                // Ordenamos los chats por la fecha del último mensaje para que los más recientes aparezcan primero
                .select("*, user1:profiles!user_id_1(*), user2:profiles!user_id_2(*), messages(*, profile:profiles!sent_by(*))")
                .or(`user_id_1.eq.${user?.id},user_id_2.eq.${user?.id}`)
                .order('created_at', { foreignTable: 'messages', ascending: false });


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
            ]).select().single(); // Usamos .single() para obtener un solo objeto

            if (error) throw error;
            
            // Después de crear el chat, actualizamos la lista
            await getChats();
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    // FUNCIÓN PARA OBTENER LAS PUBLICACIONES
    const getPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*, user:profiles(*), likes(*), comments(*, user:profiles(*))')
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            if (data) {
                setPosts(data);
                return data;
            }
        } catch (error) {
            console.log(error);
        }
        return [];
    }

    // FUNCIÓN PARA CREAR UNA PUBLICACIÓN
    const createPost = async (content: string, imageUrl: string) => {
        if (!user) return null;

        try {
            const { data, error } = await supabase
                .from('posts')
                .insert({
                    content,
                    image_url: imageUrl,
                    user_id: user.id,
                })
                .select()
                .single();

            if (error) throw error;
            
            await getPosts(); // Actualizamos la lista de posts
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }


    return <DataContext.Provider
        value={{
            chats,
            posts, // <-- AÑADE ESTA LÍNEA
            getUsers,
            getChats,
            getSingleChat,
            createChat,
            getPosts, // <-- AÑADE ESTA LÍNEA
            createPost // <-- AÑADE ESTA LÍNEA
        }}
    >
        {children}
    </DataContext.Provider>
}