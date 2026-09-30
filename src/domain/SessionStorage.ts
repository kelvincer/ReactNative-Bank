export interface Session {
    token: string
}

/**
 * Puerto de persistencia de la sesion: el dominio solo sabe que la sesion se
 * puede guardar, no que por detras hay un AsyncStorage.
 */
export interface SessionStorage {
    save: (session: Session) => Promise<void>
}
