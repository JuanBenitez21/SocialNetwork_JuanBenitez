import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Sección superior del perfil */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?u=a" }} // Imagen de avatar de ejemplo
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Nombre de Usuario</Text>
        <Text style={styles.profileBio}>
          Atleta de alto rendimiento 🏃 | Entrenador personal 🏋️ | Apasionado por el fitness y la nutrición.
        </Text>
      </View>

      {/* Sección de estadísticas o publicaciones */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>120</Text>
          <Text style={styles.statLabel}>Publicaciones</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1.5K</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>345</Text>
          <Text style={styles.statLabel}>Seguidos</Text>
        </View>
      </View>

      {/* Sección de galería de publicaciones */}
      <View style={styles.gallery}>
        <Text style={styles.galleryTitle}>Mis Publicaciones</Text>
        <View style={styles.galleryGrid}>
          {/* Aquí puedes mapear las imágenes de publicaciones */}
          <View style={styles.postImage} />
          <View style={styles.postImage} />
          <View style={styles.postImage} />
          <View style={styles.postImage} />
          <View style={styles.postImage} />
          <View style={styles.postImage} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#ccc",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  profileBio: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
  },
  gallery: {
    padding: 10,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  postImage: {
    width: "32%", // 32% para dejar un pequeño espacio entre ellas
    aspectRatio: 1, // Hace que la imagen sea cuadrada
    backgroundColor: "#ccc",
    marginBottom: 10,
    borderRadius: 8,
  },
});