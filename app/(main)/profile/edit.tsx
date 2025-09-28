// juanbenitez21/socialnetwork_juanbenitez/SocialNetwork_JuanBenitez-develop/app/(main)/profile/edit.tsx

import { AuthContext } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
// CAMBIO IMPORTANTE: Así se importa ahora
import {
    MediaTypeOptions,
    launchCameraAsync,
    launchImageLibraryAsync,
    requestCameraPermissionsAsync,
    requestMediaLibraryPermissionsAsync,
    type ImagePickerOptions,
    type ImagePickerResult
} from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function EditProfile() {
    const router = useRouter();
    const { user, updateProfile, uploadStorage } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        bio: user?.bio || '',
        website: user?.website || '',
        location: user?.location || '',
        phone: user?.phone || ''
    });

    const [loading, setLoading] = useState(false);
    const [newAvatar, setNewAvatar] = useState<{ uri: string; base64: string } | null>(null);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const selectImage = async () => {
        Alert.alert(
            "Seleccionar Imagen",
            "Elige una opción para tu foto de perfil",
            [
                { text: "Tomar Foto", onPress: () => pickImage('camera') },
                { text: "Elegir de la Galería", onPress: () => pickImage('gallery') },
                { text: "Cancelar", style: "cancel" }
            ]
        );
    };

    const pickImage = async (source: 'camera' | 'gallery') => {
        let result: ImagePickerResult;
        const options: ImagePickerOptions = {
            mediaTypes: MediaTypeOptions.Images, // CORREGIDO: Usamos la importación correcta
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,
        };

        if (source === 'camera') {
            const { status } = await requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitas dar permiso para acceder a la cámara.');
                return;
            }
            result = await launchCameraAsync(options);
        } else {
            const { status } = await requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitas dar permiso para acceder a la galería.');
                return;
            }
            result = await launchImageLibraryAsync(options);
        }

        if (!result.canceled && result.assets && result.assets[0].base64) {
            setNewAvatar({
                uri: result.assets[0].uri,
                base64: result.assets[0].base64
            });
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'El nombre es requerido');
            return;
        }
        setLoading(true);

        try {
            let avatarUrlToUpdate = user?.avatar_url;

            if (newAvatar && user?.id) {
                console.log("Iniciando subida de nueva imagen...");
                const fileExt = newAvatar.uri.split('.').pop() || 'jpg';
                const contentType = `image/${fileExt}`;
                const fileName = `${user.id}_avatar_${Date.now()}.${fileExt}`;

                const newPublicUrl = await uploadStorage('avatars', fileName, newAvatar.base64, contentType);

                if (newPublicUrl) {
                    console.log('Imagen subida con éxito. URL:', newPublicUrl);
                    avatarUrlToUpdate = newPublicUrl;
                } else {
                    Alert.alert('Error', 'No se pudo subir la nueva imagen de perfil.');
                    setLoading(false);
                    return;
                }
            }
            
            console.log("Actualizando perfil...");
            const success = await updateProfile({
                name: formData.name.trim(),
                username: formData.username.trim() || undefined,
                bio: formData.bio.trim() || undefined,
                website: formData.website.trim() || undefined,
                location: formData.location.trim() || undefined,
                phone: formData.phone.trim() || undefined,
                avatar_url: avatarUrlToUpdate
            });

            if (success) {
                Alert.alert('Éxito', 'Perfil actualizado correctamente', [{ text: 'OK', onPress: () => router.back() }]);
            } else {
                Alert.alert('Error', 'No se pudo actualizar el perfil. Intenta de nuevo.');
            }
        } catch (error: any) {
            console.error('Error al guardar el perfil:', error);
            const errorMessage = error?.message || 'Ocurrió un error inesperado.';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.avatarSection}>
                <TouchableOpacity onPress={selectImage} style={styles.avatarContainer}>
                    <Image
                        source={{ uri: newAvatar?.uri || user?.avatar_url || 'https://via.placeholder.com/100/e1e1e1/666?text=User' }}
                        style={styles.avatar}
                    />
                    <View style={styles.avatarOverlay}>
                        <Ionicons name="camera" size={20} color="white" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={selectImage}>
                    <Text style={styles.changePhotoText}>Cambiar foto de perfil</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.form}>
                 {/* El resto del JSX no necesita cambios */}
                 <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Nombre *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        placeholder="Tu nombre completo"
                        placeholderTextColor="#999"
                        maxLength={50}
                    />
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Nombre de usuario</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.username}
                        onChangeText={(value) => handleInputChange('username', value)}
                        placeholder="@nombredeusuario"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        maxLength={30}
                    />
                    <Text style={styles.helpText}>
                        Solo letras, números y guiones bajos
                    </Text>
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Biografía</Text>
                    <TextInput
                        style={[styles.input, styles.bioInput]}
                        value={formData.bio}
                        onChangeText={(value) => handleInputChange('bio', value)}
                        placeholder="Cuéntanos sobre ti..."
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                        maxLength={150}
                        textAlignVertical="top"
                    />
                    <Text style={styles.characterCount}>
                        {formData.bio.length}/150
                    </Text>
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Sitio web</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.website}
                        onChangeText={(value) => handleInputChange('website', value)}
                        placeholder="https://tusitio.com"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        keyboardType="url"
                        maxLength={100}
                    />
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Ubicación</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.location}
                        onChangeText={(value) => handleInputChange('location', value)}
                        placeholder="Ciudad, País"
                        placeholderTextColor="#999"
                        maxLength={50}
                    />
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.phone}
                        onChangeText={(value) => handleInputChange('phone', value)}
                        placeholder="+1 234 567 8900"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        maxLength={20}
                    />
                </View>
            </View>
            <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveButton, loading && styles.buttonDisabled]}
                disabled={loading}
            >
                <Text style={styles.saveButtonText}>
                    {loading ? 'Guardando...' : 'Guardar'}
                </Text>
            </TouchableOpacity>
            <View style={styles.bottomPadding} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 10,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    buttonDisabled: {
        backgroundColor: '#a9d2ff',
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
    },
    avatarOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 15,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    changePhotoText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
    },
    form: {
        padding: 16,
    },
    fieldContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    bioInput: {
        height: 80,
        paddingTop: 12,
    },
    helpText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    characterCount: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
        marginTop: 4,
    },
    bottomPadding: {
        height: 50,
    },
});