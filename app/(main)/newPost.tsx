import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PostScreen() {
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleChooseImage = async () => {
    // Pedir permisos para acceder a la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas dar permiso para acceder a la galería.');
      return;
    }

    // Abrir la galería de imágenes
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    // Aquí iría la lógica para enviar la publicación a un servidor
    // Por ahora, solo mostraremos una alerta con los datos
    if (postText.trim() === '' && !selectedImage) {
      Alert.alert('Error', 'Debes escribir algo o seleccionar una imagen para publicar.');
      return;
    }

    Alert.alert(
      'Publicación Exitosa',
      `Texto: ${postText}\nImagen seleccionada: ${selectedImage ? 'Sí' : 'No'}`
    );

    // Limpiar los campos después de la publicación
    setPostText('');
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nueva Publicación</Text>
      
      {/* Campo de texto */}
      <TextInput
        style={styles.textInput}
        placeholder="¿Qué tienes en mente hoy?"
        placeholderTextColor="#999"
        multiline
        value={postText}
        onChangeText={setPostText}
      />
      
      {/* Previsualización de la imagen */}
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
      )}
      
      {/* Botón para seleccionar imagen */}
      <TouchableOpacity style={styles.imageButton} onPress={handleChooseImage}>
        <Text style={styles.imageButtonText}>Elegir Foto de la Galería</Text>
      </TouchableOpacity>
      
      {/* Botón de publicar */}
      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postButtonText}>Publicar</Text>
      </TouchableOpacity>
    </View>
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
    height: 200,
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