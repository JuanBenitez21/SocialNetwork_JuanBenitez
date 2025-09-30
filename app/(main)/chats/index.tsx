// app/(main)/chat/index.tsx
import { AuthContext } from '@/contexts/AuthContext';
import { DataContext } from '@/contexts/DataContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function ChatIndex() {

    const [users, setUsers] = useState<any[]>([]);
    const { user } = useContext(AuthContext)
    const { getUsers, getChats, chats, createChat } = useContext(DataContext)
    const router = useRouter();


    useEffect(() => {
        initProfiles()
        initChats()
    }, [])

    const initProfiles = async () => {
        try {
            const response = await getUsers();
            if (user) {
                setUsers(response.filter(value => value.id !== user.id));
            }
        } catch (error) {
            console.log(error)
        }
    }

    const initChats = async () => {
        try {
            await getChats();
        } catch (error) {
            console.log(error)
        }
    }

    const handleGoToChat = async (payload: { chatId?: string, userId?: string }) => {
        if (payload.chatId) {
            // Navegación corregida con objeto
            router.push({
                pathname: "/(main)/chats/chat/[id]",
                params: { id: payload.chatId }
            });
        } else if (payload.userId) {
            // Primero, busca si ya existe un chat con ese usuario
            const chat = chats.find(c => (c.user_id_1 === payload.userId && c.user_id_2 === user?.id) || (c.user_id_2 === payload.userId && c.user_id_1 === user?.id));

            if (chat) {
                // Si existe, navega a ese chat
                router.push({
                    pathname: "/(main)/chats/chat/[id]",
                    params: { id: chat.id }
                });
            } else {
                // Si no existe, crea un nuevo chat y luego navega
                const newChat = await createChat(payload.userId);
                if (newChat) {
                    router.push({
                        pathname: "/(main)/chats/chat/[id]",
                        params: { id: newChat.id }
                    });
                }
            }
        }
    }

    const Button = ({ value }: any) => {
        const isChat = !!value.messages;
        const otherUser = isChat ? (value.user1?.id === user?.id ? value.user2 : value.user1) : null;
        const name = isChat ? otherUser?.name : value.name;
        const avatarUrl = isChat ? otherUser?.avatar_url : value.avatar_url;
        const lastMessage = isChat && value.messages.length > 0 ? value.messages[value.messages.length - 1].text : null;


        return (
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => handleGoToChat(isChat ? { chatId: value.id } : { userId: value.id })}
            >
                <View style={styles.userInfoContainer}>
                    <Image
                        style={styles.avatar}
                        source={{ uri: avatarUrl || 'https://via.placeholder.com/150' }}
                        placeholder={{ blurhash }}
                        contentFit="cover"
                        transition={1000}
                    />
                    <View>
                        <Text style={styles.userName}>{name}</Text>
                        {lastMessage &&
                            <Text style={styles.lastMessage}>{lastMessage}</Text>
                        }
                    </View>
                </View>
                <AntDesign name="right" size={24} color="black" />
            </TouchableOpacity>
        )
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Users</Text>
                {users?.map((value) => <Button key={`user-${value.id}`} value={value} />)}

                <Text style={styles.title}>Chats</Text>
                {chats?.map((value) => <Button key={`chat-${value.id}`} value={value} />)}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 20,
        padding: 20
    },
    title: {
        fontWeight: "bold",
        fontSize: 24,
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    userInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    userName: {
        fontWeight: "600",
        fontSize: 16
    },
    lastMessage: {
        fontSize: 14,
        color: 'gray'
    }
})