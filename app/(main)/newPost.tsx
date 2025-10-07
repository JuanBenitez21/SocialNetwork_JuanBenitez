// juanbenitez21/socialnetwork_juanbenitez/SocialNetwork_JuanBenitez-testeodeFrente/app/(main)/newPost.tsx

import CameraModal from '@/components/modalCamera';
import { AuthContext } from '@/contexts/AuthContext';
import { DataContext } from '@/contexts/DataContext';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

export default function PostScreen() {
    const [postText, setPostText] = useState('');
    const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { uploadStorage, user } = useContext(AuthContext);
    const { createPost } = useContext(DataContext);


    const handleImageSelected = (asset: ImagePicker.ImagePickerAsset) => {
        setSelectedImage(asset);
        setIsModalVisible(false);
    };

    const handlePost = async () => {
        if (!user) return;
        if (postText.trim() === '' || !selectedImage) { // Ahora la imagen es obligatoria
            Alert.alert('Error', 'Debes escribir algo y seleccionar una imagen para publicar.');
            return;
        }
    
        try {
            let imageUrl = '';
            if (selectedImage?.base64) {
                const fileExt = selectedImage.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
                const contentType = `image/${fileExt}`;
                const fileName = `post_${user.id}_${Date.now()}.${fileExt}`;
    
                const publicUrl = await uploadStorage('posts', fileName, selectedImage.base64, contentType);
                if (!publicUrl) {
                    throw new Error("No se pudo subir la imagen.");
                }
                imageUrl = publicUrl;
            }
    
            const newPost = await createPost(postText, imageUrl);
    
            if (newPost) {
                Alert.alert('Publicación Exitosa', 'Tu post ha sido creado.');
                setPostText('');
                setSelectedImage(null);
            } else {
                throw new Error("No se pudo crear la publicación.");
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        // El ScrollView ahora usa contentContainerStyle
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Crear Nueva Publicación</Text>

            <TextInput
                style={styles.textInput}
                placeholder="¿Qué tienes en mente hoy?"
                placeholderTextColor="#999"
                multiline
                value={postText}
                onChangeText={setPostText}
            />

            {selectedImage && (
                <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
            )}

            <TouchableOpacity
                style={styles.imageButton}
                onPress={() => setIsModalVisible(true)}
            >
                <Text style={styles.imageButtonText}>Elegir Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
                <Text style={styles.postButtonText}>Publicar</Text>
            </TouchableOpacity>

            <CameraModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onImageSelected={handleImageSelected}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1, // <- Se elimina el flex: 1
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    textInput: {
        height: 120,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
        textAlignVertical: 'top',
        backgroundColor: '#fff',
    },
    imagePreview: {
        width: '100%',
        height: 300, // Altura fija para la previsualización
        borderRadius: 10,
        marginBottom: 15,
        resizeMode: 'cover',
    },
    imageButton: {
        backgroundColor: '#ccc',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    imageButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    postButton: {
        backgroundColor: '#222',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    postButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});