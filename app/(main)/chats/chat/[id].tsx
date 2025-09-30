// app/(main)/chat/[id].tsx
import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChatScreen() {
    const { id: chatId } = useLocalSearchParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = React.useContext(AuthContext);

    useEffect(() => {
        fetchMessages();

        const channel = supabase.channel(`public:messages:chat_id=eq.${chatId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, (payload) => {
                setMessages(currentMessages => [payload.new, ...currentMessages]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [chatId]);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
        } else {
            setMessages(data);
        }
    };

    const handleSend = async () => {
        if (newMessage.trim() === '') return;

        const { error } = await supabase.from('messages').insert([
            { text: newMessage, sent_by: user?.id, chat_id: chatId }
        ]);

        if (error) {
            console.error(error);
        } else {
            setNewMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.sent_by === user?.id ? styles.myMessage : styles.theirMessage]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                inverted
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Escribe un mensaje..."
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Text>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    input: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
    },
    sendButton: {
        marginLeft: 10,
        justifyContent: 'center'
    },
    messageBubble: {
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 20,
        maxWidth: '80%',
    },
    myMessage: {
        backgroundColor: '#dcf8c6',
        alignSelf: 'flex-end',
    },
    theirMessage: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    }
});