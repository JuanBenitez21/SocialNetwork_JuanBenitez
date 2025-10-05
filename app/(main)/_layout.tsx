import { BlurView } from "expo-blur";
import { Link, Stack, usePathname } from "expo-router";
import {
  Home,
  MessageCircle,
  PlusCircle,
  UserCircle,
  Video,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MainLayout() {
  const pathname = usePathname();

  // Lógica más segura y directa para determinar si la barra de navegación debe ocultarse.
  // El '?' (optional chaining) previene errores si `pathname` es nulo temporalmente.
  const isNavBarHidden =
    pathname?.startsWith('app/(main)/chats/chat/[id].tsx') || // Ocultar en un chat individual
    pathname === 'app/(main)/profile/edit.tsx';           // Ocultar al editar el perfil

  // Lógica para determinar qué ícono está activo
  const isHomeActive = pathname === '/(main)/home';
  const isChatsActive = pathname?.startsWith('/(main)/chats');
  const isNewPostActive = pathname === '/(main)/newPost';
  const isReelsActive = pathname === '/(main)/reels';
  const isProfileActive = pathname?.startsWith('/(main)/profile');

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

      {!isNavBarHidden && (
        <BlurView style={styles.navBarContainer} tint="dark" intensity={70}>
          <View style={styles.navBar}>
            {/* Main */}
            <Link href="/(main)/home" asChild>
              <Pressable
                style={[
                  styles.navBarButton,
                  isHomeActive ? styles.active : styles.inactive,
                ]}
              >
                <Home size={24} color={isHomeActive ? "#fff" : "#ccc"} />
                <Text style={styles.navBarText}>Main</Text>
              </Pressable>
            </Link>

            {/* Chat */}
            <Link href="/(main)/chats" asChild>
              <Pressable
                style={[
                  styles.navBarButton,
                  isChatsActive ? styles.active : styles.inactive,
                ]}
              >
                <MessageCircle
                  size={24}
                  color={isChatsActive ? "#fff" : "#ccc"}
                />
                <Text style={styles.navBarText}>Chat</Text>
              </Pressable>
            </Link>

            {/* Post */}
            <Link href="/(main)/newPost" asChild>
              <Pressable
                style={[
                  styles.navBarButton,
                  isNewPostActive ? styles.active : styles.inactive,
                ]}
              >
                <PlusCircle
                  size={24}
                  color={isNewPostActive ? "#fff" : "#ccc"}
                />
                <Text style={styles.navBarText}>Post</Text>
              </Pressable>
            </Link>

            {/* Reels */}
            <Link href="/(main)/reels" asChild>
              <Pressable
                style={[
                  styles.navBarButton,
                  isReelsActive ? styles.active : styles.inactive,
                ]}
              >
                <Video size={24} color={isReelsActive ? "#fff" : "#ccc"} />
                <Text style={styles.navBarText}>Reels</Text>
              </Pressable>
            </Link>

            {/* Perfil */}
            <Link href="/(main)/profile" asChild>
              <Pressable
                style={[
                  styles.navBarButton,
                  isProfileActive ? styles.active : styles.inactive,
                ]}
              >
                <UserCircle
                  size={24}
                  color={isProfileActive ? "#fff" : "#ccc"}
                />
                <Text style={styles.navBarText}>Perfil</Text>
              </Pressable>
            </Link>
          </View>
        </BlurView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
    navBarContainer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 15,
        overflow: "hidden",
    },
    navBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    navBarButton: {
        alignItems: "center",
    },
    active: {
        opacity: 1,
    },
    inactive: {
        opacity: 0.5,
    },
    navBarText: {
        fontSize: 12,
        marginTop: 4,
        color: "#fff",
    },
});