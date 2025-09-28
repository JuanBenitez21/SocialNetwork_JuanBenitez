import CameraModal from '@/components/modalCamera';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PostScreen() {
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleImageSelected = (uri: string) => {
    setSelectedImage(uri);
    setIsModalVisible(false); // Importante: cierra el modal después de seleccionar la imagen.
  };

  const handlePost = () => {
    if (postText.trim() === '' && !selectedImage) {
      Alert.alert('Error', 'Debes escribir algo o seleccionar una imagen para publicar.');
      return;
    }

    Alert.alert(
      'Publicación Exitosa',
      `Texto: ${postText}\nImagen seleccionada: ${selectedImage ? 'Sí' : 'No'}`
    );

    setPostText('');
    setSelectedImage(null);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.container}>
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
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        )}
        
        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => setIsModalVisible(true)} // Ahora este botón solo abre el modal
        >
          <Text style={styles.imageButtonText}>Elegir Foto de la Galería</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Publicar</Text>
        </TouchableOpacity>
        
        <CameraModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onImageSelected={handleImageSelected}
        />
      </View>
      </ScrollView>
      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: '100%',
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