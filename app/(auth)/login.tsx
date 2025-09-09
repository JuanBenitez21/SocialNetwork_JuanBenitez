import { useRouter } from "expo-router"; // <-- Importamos useRouter
import React from "react";
import { Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EntryPoint() {
  const router = useRouter(); // <-- Inicializamos el hook

  // Funciones para la navegación
  const goToRegister = () => {
    router.navigate('/register');
  };

  const goToRecover = () => {
    router.navigate('/recover');
  };

  // Por ahora, el login redirigirá al perfil
  const goToProfile = () => {
    router.navigate('/profile'); // La ruta al perfil
  };
  

  return (
    <ImageBackground
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Avatar */}
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png" }} // Ícono de usuario
          style={styles.avatar}
        />

        {/* Inputs */}
        <TextInput
          placeholder="Username"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
        />

        {/* Opciones */}
        <View style={styles.optionsRow}>
          <TouchableOpacity onPress={goToRegister}>
            <Text style={styles.remember}>Registrarme</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToRecover}>
            <Text style={styles.forgot}>¿Olvidaste tu Contraseña?</Text>
          </TouchableOpacity>
        </View>

        {/* Botón Login */}
        <TouchableOpacity style={styles.button} onPress={goToProfile}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 30,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  remember: {
    color: "#fff",
    fontSize: 14,
  },
  forgot: {
    color: "#ddd",
    fontSize: 14,
    fontStyle: "italic",
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#222",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});