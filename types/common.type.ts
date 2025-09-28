// types/common.type.ts
export interface User {
    id: string, // <-- AÑADE ESTA LÍNEA
    email: string,
    username: string,
    name: string,
    lastName: string,
    avatar_url?: string, // Agregado para el avatar
    cover_url?: string, // Agregado
    bio?: string, // Agregado
    website?: string, // Agregado
    location?: string, // Agregado
    phone?: string, // Agregado
    posts_count?: number, // Agregado
    followers_count?: number, // Agregado
    following_count?: number, // Agregado
    age?: number, // El que ya tenías
}