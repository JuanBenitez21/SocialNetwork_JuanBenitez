import { Stack } from "expo-router";

export default function LayoutAuth() {
  return (
    <Stack>
      <Stack.Screen 
        name="register" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="login" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="recover" 
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}