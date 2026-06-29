import FirestoreService from "./firestoreService";
import { db } from "../database/db";
import { saveMessage } from "../database/chatQueries";

class ChatSyncService {
  // ==========================
  // Sync Chats
  // ==========================

  async syncChats() {
    try {
      const chats = await FirestoreService.getChats();

      for (const chat of chats as any[]) {
        db.execute(
          `INSERT OR REPLACE INTO chats
          (id, title, lastMessage, updatedAt, createdAt)
          VALUES (?, ?, ?, ?, ?)`,
          [
            chat.id,
            chat.title ?? "New Chat",
            chat.lastMessage ?? "",
            chat.updatedAt?.seconds
              ? chat.updatedAt.seconds * 1000
              : Date.now(),
            chat.createdAt?.seconds
              ? chat.createdAt.seconds * 1000
              : Date.now(),
          ]
        );
      }

      console.log("Chats synced successfully ✅");
    } catch (e) {
      console.log("Chat sync failed ❌", e);
    }
  }

  // ==========================
  // Sync Messages
  // ==========================

  async syncMessages(chatId: string) {
    try {
      const messages =
        await FirestoreService.getMessages(chatId);

      for (const message of messages as any[]) {
        await saveMessage(
          {
            id: message.id,
            chatId,
            sender: message.sender,
            text: message.text,
          },
          false // Don't upload back to Firestore
        );
      }

      console.log("Messages synced successfully ✅");
    } catch (e) {
      console.log("Message sync failed ❌", e);
    }
  }
}

export default new ChatSyncService();