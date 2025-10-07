// components/PostItem.tsx

import { AuthContext } from '@/contexts/AuthContext';
import { DataContext } from '@/contexts/DataContext';
import { supabase } from '@/utils/supabase';
import { Heart, MessageCircle } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PostItem({ post }: { post: any }) {
    const { user } = useContext(AuthContext);
    const { getPosts } = useContext(DataContext);
    const [isLiked, setIsLiked] = useState(post.likes.some((like: any) => like.user_id === user?.id));

    const handleLike = async () => {
        if (!user) return;

        try {
            if (isLiked) {
                // Si ya le dio like, se lo quitamos
                const { error } = await supabase
                    .from('likes')
                    .delete()
                    .match({ post_id: post.id, user_id: user.id });
                if (error) throw error;
                setIsLiked(false);
            } else {
                // Si no le ha dado like, lo agregamos
                const { error } = await supabase
                    .from('likes')
                    .insert({ post_id: post.id, user_id: user.id });
                if (error) throw error;
                setIsLiked(true);
            }
            getPosts(); // Actualizamos los posts
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: post.user.avatar_url || 'https://via.placeholder.com/40' }} style={styles.avatar} />
                <Text style={styles.username}>{post.user.username}</Text>
            </View>
            <Image source={{ uri: post.image_url }} style={styles.postImage} />
            <View style={styles.actions}>
                <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
                    <Heart size={24} color={isLiked ? 'red' : 'black'} fill={isLiked ? 'red' : 'none'} />
                    <Text>{post.likes_count}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={24} color="black" />
                    <Text>{post.comments_count}</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.content}>{post.content}</Text>
        </View>
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
    },
    content: {
        marginTop: 10,
    }
});