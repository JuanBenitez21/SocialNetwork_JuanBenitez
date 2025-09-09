import { useRouter } from "expo-router";
import React from "react";
import { Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RecoverPasswordScreen() {
  const router = useRouter();

  const goToLogin = () => {
    router.navigate('/login');
  };

  return (
    <ImageBackground
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Ícono */}
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/3239/3239460.png" }} // Ícono de candado
          style={styles.avatar}
        />

        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa tu correo electrónico para recibir las instrucciones de recuperación.
        </Text>

        {/* Input */}
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#aaa"
          style={styles.input}
        />

        {/* Botón de envío */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>ENVIAR</Text>
        </TouchableOpacity>

        {/* Botón para volver al login */}
        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.backButton}>Volver a Iniciar Sesión</Text>
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
    backgroundColor: "rgba(0,0,0,0.4)", // fondo semitransparente
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
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
  },
});