import { AuthContext } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function EditProfile() {
    const router = useRouter();
    const { user, updateProfile } = useContext(AuthContext);

    // Estados para los campos del formulario
    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        bio: user?.bio || '',
        website: user?.website || '',
        location: user?.location || '',
        phone: user?.phone || ''
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        // Validaciones básicas
        if (!formData.name.trim()) {
            Alert.alert('Error', 'El nombre es requerido');
            return;
        }

        if (formData.username && formData.username.length < 3) {
            Alert.alert('Error', 'El nombre de usuario debe tener al menos 3 caracteres');
            return;
        }

        setLoading(true);

        try {
            const success = await updateProfile({
                name: formData.name.trim(),
                username: formData.username.trim() || undefined,
                bio: formData.bio.trim() || undefined,
                website: formData.website.trim() || undefined,
                location: formData.location.trim() || undefined,
                phone: formData.phone.trim() || undefined
            });

            if (success) {
                Alert.alert(
                    'Éxito',
                    'Perfil actualizado correctamente',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.back()
                        }
                    ]
                );
            } else {
                Alert.alert('Error', 'No se pudo actualizar el perfil. Intenta de nuevo.');
            }

        } catch (error: any) {
            console.error('Update profile error:', error);
            const errorMessage = error?.message || 'Ocurrió un error inesperado. Intenta de nuevo.';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const selectImage = () => {
        Alert.alert(
            'Cambiar foto de perfil',
            'Selecciona una opción',
            [
                { text: 'Cámara', onPress: () => console.log('Camera selected') },
                { text: 'Galería', onPress: () => console.log('Gallery selected') },
                { text: 'Cancelar', style: 'cancel' }
            ]
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.avatarSection}>
                <TouchableOpacity onPress={selectImage} style={styles.avatarContainer}>
                    <Image
                        source={{
                            uri: user?.avatar_url || 'https://via.placeholder.com/100/e1e1e1/666?text=User'
                        }}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
        paddingTop: Platform.OS === 'ios' ? 50 : 12,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    saveButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignContent: "center",
        alignItems: "center"
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    },
    buttonDisabled: {
        opacity: 0.5,
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