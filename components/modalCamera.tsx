import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CameraModalProps {
  isVisible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string) => void;
}

export default function CameraModal({
  isVisible,
  onClose,
  onImageSelected,
}: CameraModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [cameraIsActive, setCameraIsActive] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const handleCameraPress = async () => {
    if (!permission?.granted) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitas dar permiso para acceder a la cámara.');
        return;
      }
    }
    setCameraIsActive(true);
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo?.uri) {
        onImageSelected(photo.uri);
        setCameraIsActive(false);
        onClose();
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType((current: CameraType) => (current === 'back' ? 'front' : 'back'));
  };

  const handleGalleryPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas dar permiso para acceder a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
      onClose();
    }
  };

  const closeModal = () => {
    setCameraIsActive(false);
    onClose();
  };

  if (!permission) {
    return <Text>Cargando permisos...</Text>;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        {cameraIsActive ? (
          <View style={styles.cameraContainer}>
            <CameraView style={styles.camera} facing={cameraType} ref={cameraRef}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cameraButton} onPress={toggleCameraType}>
                  <Text style={styles.textStyle}>Voltear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
                  <Text style={styles.textStyle}>Capturar</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
        ) : (
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Cambiar Imagen de Perfil</Text>
            <TouchableOpacity style={styles.button} onPress={handleCameraPress}>
              <Text style={styles.textStyle}>Tomar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleGalleryPress}
            >
              <Text style={styles.textStyle}>Elegir de la Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={closeModal}
            >
              <Text style={[styles.textStyle, styles.cancelText]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: '100%',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textStyle: {
    color: '#007AFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelText: {
    color: '#ff3b30',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  cameraButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderRadius: 10,
  },
  captureButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
});