
import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react'; // <-- 1. Importa useRef
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'; // <-- 2. Importa KeyboardAvoidingView y Platform

export default function ChatScreen() {
    const { id: chatId } = useLocalSearchParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = React.useContext(AuthContext);
    const flatListRef = useRef<FlatList>(null); // <-- 3. Crea una referencia para la FlatList

    useEffect(() => {
        fetchMessages();

        const channel = supabase.channel(`public:messages:chat_id=eq.${chatId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, (payload) => {
                // 4. Agrega nuevos mensajes al final del array
                setMessages(currentMessages => [...currentMessages, payload.new]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [chatId]);

    // 5. Agrega un useEffect para hacer scroll al final cuando lleguen mensajes
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            // 6. Cambia el orden a ascendente para mostrar los más antiguos primero
            .order('created_at', { ascending: true });

        if (error) {
            console.error(error);
        } else {
            setMessages(data);
        }
    };

    const handleSend = async () => {
        if (newMessage.trim() === '') return;

        // Optimización: Añade el mensaje localmente de inmediato para una mejor UX
        const optimisticMessage = {
            id: Math.random(), // ID temporal
            text: newMessage,
            sent_by: user?.id,
            chat_id: chatId,
            created_at: new Date().toISOString()
        };
        setMessages(currentMessages => [...currentMessages, optimisticMessage]);
        setNewMessage('');

        // Envía el mensaje a la base de datos
        const { error } = await supabase.from('messages').insert([
            { text: newMessage, sent_by: user?.id, chat_id: chatId }
        ]);

        if (error) {
            console.error(error);
            // Si hay un error, podrías querer revertir el mensaje optimista
            setMessages(currentMessages => currentMessages.filter(m => m.id !== optimisticMessage.id));
            Alert.alert("Error", "No se pudo enviar el mensaje.");
        }
    };

    return (
        // 7. Envuelve todo en un KeyboardAvoidingView para que el teclado no tape el input
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={90} // Ajusta este valor según sea necesario
        >
            <FlatList
                ref={flatListRef} // Asigna la referencia
                data={messages}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.sent_by === user?.id ? styles.myMessage : styles.theirMessage]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => item.id?.toString() ?? `msg-${index}`}
                // 8. Quita la propiedad 'inverted'
                contentContainerStyle={{ paddingBottom: 10 }} // Añade un poco de espacio al final
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
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5' // Un color de fondo más suave para el chat
    },
    // ... (tus otros estilos aquí)
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e8e8e8'
    },
    input: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff'
    },
    sendButton: {
        marginLeft: 10,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    messageBubble: {
        padding: 10,
        marginVertical: 4,
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