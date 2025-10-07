// app/(main)/chats/chat/[id].tsx

import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function ChatScreen() {
    const { id: chatId } = useLocalSearchParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const { user, uploadStorage } = useContext(AuthContext);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (!chatId) return;

        fetchMessages();

        const messagesChannel = supabase.channel(`chat_messages_${chatId}`)
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}`
            }, (payload) => {
                setMessages(currentMessages => {
                    if (currentMessages.find(m => m.id === payload.new.id)) {
                        return currentMessages;
                    }
                    return [...currentMessages, { ...payload.new, media: [] }];
                });
            })
            .subscribe();
            
        const mediaChannel = supabase.channel(`chat_media_${chatId}`)
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public', table: 'media'
            }, (payload) => {
                 setMessages(currentMessages => currentMessages.map(msg =>
                    msg.id === payload.new.message_id
                    ? { ...msg, media: [...msg.media, payload.new] }
                    : msg
                 ));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(messagesChannel);
            supabase.removeChannel(mediaChannel);
        };
    }, [chatId]);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages]);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*, media(*)')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });

        if (error) console.error(error);
        else setMessages(data);
    };

    const handleSend = async () => {
        if (imagePreview) {
            await handleSendImage();
        } else if (newMessage.trim() !== '') {
            await handleSendText();
        }
    };

    const handleSendText = async () => {
        if (newMessage.trim() === '' || !user) return;
        const textToSend = newMessage;
        setNewMessage('');

        const { error } = await supabase.from('messages').insert([
            { text: textToSend, sent_by: user.id, chat_id: chatId }
        ]);

        if (error) {
            console.error("Error sending message:", error);
            Alert.alert("Error", "No se pudo enviar el mensaje.");
            setNewMessage(textToSend);
        }
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitas dar permiso para acceder a la galería.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImagePreview(result.assets[0]);
            setNewMessage('');
        }
    };

    const handleSendImage = async () => {
        // --- CORRECCIÓN DEFINITIVA ---
        // 1. Verificamos que tanto el objeto de la imagen como su base64 existen.
        if (!imagePreview || !imagePreview.base64 || !user) {
            Alert.alert("Error", "No se pudo procesar la imagen. Por favor, intenta de nuevo.");
            if (imagePreview) setImagePreview(null); // Limpia si es inválido
            return;
        }

        setIsUploading(true);
        
        // 2. Guardamos los datos en constantes. TypeScript ahora sabe que son seguros.
        const assetToUpload = imagePreview;
        const base64Data = imagePreview.base64; // <- Esta variable ahora es de tipo 'string'
        
        // 3. Limpiamos la UI
        setImagePreview(null); 

        try {
            const fileExt = assetToUpload.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
            const contentType = `image/${fileExt}`;
            const fileName = `chat_${chatId}_${Date.now()}.${fileExt}`;

            // 4. Usamos la variable segura para la subida
            const publicUrl = await uploadStorage('chat_media', fileName, base64Data, contentType);

            if (!publicUrl) {
                throw new Error("No se pudo obtener la URL de la imagen.");
            }

            const { data: messageData, error: messageError } = await supabase
                .from('messages')
                .insert({ sent_by: user.id, chat_id: chatId, text: null })
                .select()
                .single();

            if (messageError || !messageData) {
                throw new Error(messageError?.message || "Error al crear el mensaje para la imagen.");
            }

            const { error: mediaError } = await supabase.from('media').insert({
                message_id: messageData.id,
                url: publicUrl,
                type: 'image'
            });

            if (mediaError) {
                throw new Error(mediaError.message);
            }
        } catch (error: any) {
            console.error("Error sending image:", error);
            Alert.alert("Error", "No se pudo enviar la imagen. " + error.message);
            setImagePreview(assetToUpload); // Si falla, restauramos la preview
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={90}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => {
                    const isMyMessage = item.sent_by === user?.id;
                    const hasImage = item.media && item.media.length > 0;

                    return (
                        <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.theirMessage]}>
                            {hasImage ? (
                                <Image
                                    source={{ uri: item.media[0].url }}
                                    style={styles.image}
                                    placeholder={{ blurhash }}
                                    contentFit="cover"
                                    transition={300}
                                />
                            ) : (
                                <Text style={isMyMessage ? styles.myMessageText : styles.theirMessageText}>
                                    {item.text}
                                </Text>
                            )}
                        </View>
                    )
                }}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
            />
            
            {imagePreview && (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: imagePreview.uri }} style={styles.previewImage} />
                    <TouchableOpacity onPress={() => setImagePreview(null)} style={styles.previewCloseButton}>
                        <Ionicons name="close-circle" size={28} color="#000" />
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={handlePickImage} style={styles.attachButton} disabled={isUploading || !!imagePreview}>
                    <Ionicons name="add" size={24} color={isUploading || imagePreview ? '#ccc' : '#007AFF'} />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Escribe un mensaje..."
                    placeholderTextColor="#999"
                    editable={!imagePreview}
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={isUploading}>
                    {isUploading ? <ActivityIndicator size="small" color="#007AFF"/> : <Text style={styles.sendButtonText}>Enviar</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

// Los estilos se mantienen igual que en la respuesta anterior
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5'
    },
    listContent: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    previewContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e8e8e8',
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    previewCloseButton: {
        position: 'absolute',
        top: 0,
        right: 5,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e8e8e8',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
    },
    attachButton: {
        marginRight: 10,
        padding: 5,
    },
    sendButton: {
        marginLeft: 10,
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    sendButtonText: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 16,
    },
    messageBubble: {
        padding: 4,
        marginVertical: 5,
        borderRadius: 20,
        maxWidth: '80%',
    },
    myMessage: {
        backgroundColor: '#007AFF',
        alignSelf: 'flex-end',
    },
    theirMessage: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
    },
    myMessageText: {
        color: 'white',
        fontSize: 16,
        paddingHorizontal: 11,
        paddingVertical: 6,
    },
    theirMessageText: {
        color: 'black',
        fontSize: 16,
        paddingHorizontal: 11,
        paddingVertical: 6,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 16,
    }
});