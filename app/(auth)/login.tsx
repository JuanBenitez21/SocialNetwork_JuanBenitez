import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Alert, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EntryPoint() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const context = useContext(AuthContext);
  const router = useRouter();

  const goToRegister = () => {
    router.navigate('/register');
  };

  const goToRecover = () => {
    router.navigate('/recover');
  };
  
  const handleLogin = async () => {
    // Aquí puedes agregar validaciones para los campos
    if (email.trim() === "" || password.trim() === "") {
        Alert.alert("Error", "Por favor, ingresa tu correo y contraseña.");
        return;
    }
    const success = await context.login(email, password);
    if (success) {
      router.navigate('/(main)/home');
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
          placeholder="Correo Electrónico"
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
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