import { BlurView } from "expo-blur";
import { Link, Stack, useSegments } from "expo-router";
import {
  Home,
  MessageCircle,
  PlusCircle,
  UserCircle,
  Video,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MainLayout() {
  const segments = useSegments();
  const activePath = segments[segments.length - 1];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <BlurView style={styles.navBarContainer} tint="dark" intensity={70}>
        <View style={styles.navBar}>
          <Link href="/(main)/home" asChild>
            <Pressable
              style={[
                styles.navBarButton,
                activePath === "home" ? styles.active : styles.inactive,
              ]}
            >
              <Home
                size={24}
                color={activePath === "home" ? "#fff" : "#ccc"}
              />
              <Text style={styles.navBarText}>Main</Text>
            </Pressable>
          </Link>

          <Link href="/(main)/chats" asChild>
            <Pressable
              style={[
                styles.navBarButton,
                activePath === "chat" ? styles.active : styles.inactive,
              ]}
            >
              <MessageCircle
                size={24}
                color={activePath === "chat" ? "#fff" : "#ccc"}
              />
              <Text style={styles.navBarText}>Chat</Text>
            </Pressable>
          </Link>

          <Link href="/(main)/newPost" asChild>
            <Pressable
              style={[
                styles.navBarButton,
                activePath === "newPost" ? styles.active : styles.inactive,
              ]}
            >
              <PlusCircle
                size={24}
                color={activePath === "newPost" ? "#fff" : "#ccc"}
              />
              <Text style={styles.navBarText}>Post</Text>
            </Pressable>
          </Link>

          <Link href="/(main)/reels" asChild>
            <Pressable
              style={[
                styles.navBarButton,
                activePath === "reels" ? styles.active : styles.inactive,
              ]}
            >
              <Video
                size={24}
                color={activePath === "reels" ? "#fff" : "#ccc"}
              />
              <Text style={styles.navBarText}>Reels</Text>
            </Pressable>
          </Link>

          <Link href="/(main)/profile" asChild>
            <Pressable
              style={[
                styles.navBarButton,
                activePath === "profile" ? styles.active : styles.inactive,
              ]}
            >
              <UserCircle
                size={24}
                color={activePath === "profile" ? "#fff" : "#ccc"}
              />
              <Text style={styles.navBarText}>Perfil</Text>
            </Pressable>
          </Link>
        </View>
      </BlurView>
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
    opacity: 0.5,
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