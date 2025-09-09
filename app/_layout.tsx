import { HeaderShownContext } from "@react-navigation/elements";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            screenOptions={
                
            }
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(main)" />
        </Stack>
    );
}