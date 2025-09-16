import { AuthContext } from "@/contexts/AuthContext";
import { User } from "@/types/common.type";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Alert, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EntryPoint() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const context = useContext(AuthContext);
  const router = useRouter();

  const goToLogin = () => {
    router.navigate('/login');
  };

  const handleRegister = async () => {
    // Aquí puedes agregar validaciones para los campos
    if (email.trim() === "" || password.trim() === "" || username.trim() === "") {
        Alert.alert("Error", "Por favor, llena todos los campos.");
        return;
    }

    const newUser: User = {
      email,
      username,
      name: username, // <-- ¡CORREGIDO! Usar el valor del username como nombre
      lastName: "",
      age: 0,
    };
    
    const success = await context.register(newUser, password);
    if (success) {
      router.navigate('/(main)/home'); // Redirige a la página principal después de registrarse
    }
    else {
      Alert.alert("Error", "No se pudo registrar al usuario. Por favor, intenta de nuevo.");
    }
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
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        {/* Botón de registro */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
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