import React from "react";
import { Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EntryPoint() {
  return (
    <ImageBackground
      //source={{ uri: "https://i.ibb.co/G0tJ5SX/bg-gradient.jpg" }} // Puedes usar tu propio fondo
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
          <Text style={styles.remember}>☑ Remember me</Text>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </View>

        {/* Botón Login */}
        <TouchableOpacity style={styles.button}>
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
    backgroundColor: "rgba(0,0,0,0.4)", // fondo semitransparente
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
