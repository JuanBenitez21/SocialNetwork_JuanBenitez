// juanbenitez21/socialnetwork_juanbenitez/SocialNetwork_JuanBenitez-testeodeFrente/app/(main)/profile/index.tsx

import { AuthContext } from "@/contexts/AuthContext";
import { DataContext } from "@/contexts/DataContext";
import { useRouter } from "expo-router";
import { Edit, Globe, Mail, MapPin } from "lucide-react-native";
import React, { useContext } from "react";
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Componente para la cabecera del perfil
const ProfileHeader = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  if (!user) return null;

  return (
    <>
      <View style={styles.editButtonContainer}>
        <TouchableOpacity 
          onPress={() => router.navigate('/(main)/profile/edit')}
          style={styles.editButton}
        >
          <Edit size={20} color="#007AFF" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Image
          source={{ uri: user?.avatar_url || "https://i.pravatar.cc/150?u=a" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.name} {user?.lastName}</Text>
        <Text style={styles.usernameText}>@{user?.username}</Text>
        {user?.bio && <Text style={styles.profileBio}>{user.bio}</Text>}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Mail size={18} color="#666" />
          <Text style={styles.infoText}>{user?.email}</Text>
        </View>
        {user?.website && (
          <View style={styles.infoRow}>
            <Globe size={18} color="#666" />
            <Text style={styles.infoText}>{user.website}</Text>
          </View>
        )}
        {user?.location && (
          <View style={styles.infoRow}>
            <MapPin size={18} color="#666" />
            <Text style={styles.infoText}>{user.location}</Text>
          </View>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user?.posts_count ?? 0}</Text>
          <Text style={styles.statLabel}>Publicaciones</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user?.followers_count ?? 0}</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user?.following_count ?? 0}</Text>
          <Text style={styles.statLabel}>Seguidos</Text>
        </View>
      </View>

      <Text style={styles.galleryTitle}>Mis Publicaciones</Text>
    </>
  );
};

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);
  const { posts } = useContext(DataContext);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Cargando perfil...</Text>
      </SafeAreaView>
    );
  }

  const userPosts = posts.filter(post => post.user_id === user.id);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={userPosts}
        ListHeaderComponent={<ProfileHeader />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.postImageContainer}>
            <Image source={{ uri: item.image_url }} style={styles.postImage} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.galleryGrid}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  editButtonContainer: {
    padding: 10,
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e6f0ff',
  },
  editButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#ccc",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  usernameText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  profileBio: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
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
  galleryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    paddingHorizontal: 10,
  },
  galleryGrid: {
    paddingHorizontal: 5,
  },
  postImageContainer: {
    width: '33.33%',
    padding: 2,
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#ccc",
    borderRadius: 4,
  },
});