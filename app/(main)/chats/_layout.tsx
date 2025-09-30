// app/(main)/chat/_layout.tsx
import { Stack } from 'expo-router'
import React from 'react'

export default function ChatLayout() {
    return (
        <Stack>
            <Stack.Screen name='index' options={{
                title: "Chats"
            }} />
            <Stack.Screen name='[id]' options={{
                title: "Chat"
            }} />
        </Stack>
    )
}