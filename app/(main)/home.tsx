// juanbenitez21/socialnetwork_juanbenitez/SocialNetwork_JuanBenitez-testeodeFrente/app/(main)/home.tsx

import PostItem from '@/components/PostItem';
import { DataContext } from '@/contexts/DataContext';
import React, { useContext } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export default function MainScreen() {
    const { posts } = useContext(DataContext);

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={({ item }) => <PostItem post={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    listContent: {
        padding: 10,
    },
});