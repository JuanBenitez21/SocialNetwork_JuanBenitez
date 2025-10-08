import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import React, { useContext, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface CommentsModalProps {
    isVisible: boolean;
    onClose: () => void;
    post: any;
    onCommentAdded: () => void;
}

export default function CommentsModal({
    isVisible,
    onClose,
    post,
    onCommentAdded,
}: CommentsModalProps) {
    const { user } = useContext(AuthContext);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddComment = async () => {
        if (!user || newComment.trim() === '') return;

        setLoading(true);
        try {
            const { error } = await supabase.from('comments').insert({
                post_id: post.id,
                user_id: user.id,
                content: newComment.trim(),
            });

            if (error) throw error;

            setNewComment('');
            onCommentAdded(); // Llama a la función para actualizar la UI
        } catch (error: any) {
            Alert.alert('Error', 'No se pudo añadir el comentario.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Comentarios</Text>
                    <FlatList
                        data={post.comments}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.commentContainer}>
                                <Text style={styles.commentUser}>{item.user.username}:</Text>
                                <Text style={styles.commentText}>{item.content}</Text>
                            </View>
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>No hay comentarios aún.</Text>}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Escribe un comentario..."
                            value={newComment}
                            onChangeText={setNewComment}
                        />
                        <TouchableOpacity onPress={handleAddComment} disabled={loading}>
                            {loading ? <ActivityIndicator /> : <Text style={styles.sendButton}>Enviar</Text>}
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        height: '70%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    commentContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    commentUser: {
        fontWeight: 'bold',
        marginRight: 8,
    },
    commentText: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    sendButton: {
        marginLeft: 10,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 15,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: '#ff3b30',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    }
});