import { useRouter } from "expo-router";
import React from "react";
import { Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EntryPoint() {
  const router = useRouter();

  const goToLogin = () => {
    router.navigate('/login');
  };

  const goToProfile = () => {
    router.navigate('./main/profile'); // La ruta al perfil
  };

  return (
    <ImageBackground
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Avatar */}
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
          style={styles.avatar}
        />

        {/* Inputs */}
        <TextInput
          placeholder="Nombre de Usuario"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
        />

        {/* Botón de registro */}
        <TouchableOpacity style={styles.button} onPress={goToProfile}>
          <Text style={styles.buttonText}>REGISTRARME</Text>
        </TouchableOpacity>

        {/* Botón para volver al login */}
        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.backButton}>¿Ya tienes una cuenta? Inicia Sesión</Text>
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
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#222",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    color: "#ddd",
    fontSize: 14,
    marginTop: 10,
  },
});