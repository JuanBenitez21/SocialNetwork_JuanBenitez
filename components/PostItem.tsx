import { AuthContext } from '@/contexts/AuthContext';
import { DataContext } from '@/contexts/DataContext';
import { supabase } from '@/utils/supabase';
import { Heart, MessageCircle } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommentsModal from './CommentsModal'; // <-- IMPORTA EL NUEVO MODAL

export default function PostItem({ post: initialPost }: { post: any }) {
    const { user } = useContext(AuthContext);
    const { getPosts } = useContext(DataContext);
    
    // Usamos un estado local para el post para poder actualizarlo
    const [post, setPost] = useState(initialPost);

    const [isLiked, setIsLiked] = useState(post.likes.some((like: any) => like.user_id === user?.id));
    const [likeCount, setLikeCount] = useState(post.likes.length);
    
    // Estado para controlar la visibilidad del modal de comentarios
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);

    const handleLike = async () => {
        if (!user) return;
        
        const currentlyLiked = isLiked;
        const currentCount = likeCount;

        setIsLiked(!currentlyLiked);
        setLikeCount(currentCount + (!currentlyLiked ? 1 : -1));

        try {
            if (currentlyLiked) {
                const { error } = await supabase
                    .from('likes')
                    .delete()
                    .match({ post_id: post.id, user_id: user.id });
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('likes')
                    .insert({ post_id: post.id, user_id: user.id });
                if (error) throw error;
            }
        } catch (error: any) {
            setIsLiked(currentlyLiked);
            setLikeCount(currentCount);
            Alert.alert('Error', 'No se pudo procesar el "Me gusta".');
        }
    };
    
    // Función para recargar los datos del post (incluyendo comentarios)
    const refreshPost = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*, user:profiles(*), likes(*), comments(*, user:profiles(*))')
            .eq('id', post.id)
            .single();

        if (data) {
            setPost(data);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={{ uri: post.user.avatar_url || 'https://via.placeholder.com/40' }} style={styles.avatar} />
                    <Text style={styles.username}>{post.user.username}</Text>
                </View>
                <Image source={{ uri: post.image_url }} style={styles.postImage} />
                <View style={styles.actions}>
                    <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
                        <Heart size={24} color={isLiked ? 'red' : 'black'} fill={isLiked ? 'red' : 'none'} />
                        <Text>{likeCount}</Text>
                    </TouchableOpacity>
                    {/* Abre el modal al presionar */}
                    <TouchableOpacity style={styles.actionButton} onPress={() => setIsCommentsVisible(true)}>
                        <MessageCircle size={24} color="black" />
                        <Text>{post.comments.length}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.content}>{post.content}</Text>
            </View>

            {/* Añade el modal al final del componente */}
            <CommentsModal
                isVisible={isCommentsVisible}
                onClose={() => setIsCommentsVisible(false)}
                post={post}
                onCommentAdded={refreshPost} // Llama a refreshPost cuando se añade un comentario
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontWeight: 'bold',
    },
    postImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
    },
    actions: {
        flexDirection: 'row',
        marginTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        gap: 5
    },
    content: {
        marginTop: 10,
    }
});