import { db } from './db';
import FirestoreService from "../services/firestoreService";

// ✅ Create new chat
export const createChat = async (
  chatId: string,
  mode: string,
  jurisdiction: string,
  countries: string[],
  title: string = "New Chat",
  syncToFirestore: boolean = true
) => {
  db.execute(
    `INSERT OR IGNORE INTO chats
     (id, title, lastMessage, updatedAt, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    [chatId, title, "", Date.now(), Date.now()]
  );

  if (!syncToFirestore) return;

  try {
    await FirestoreService.createChat({
      id: chatId,
      title,
      mode,
      jurisdiction,
      countries,
    });
  } catch (e) {
    console.log("Firestore createChat failed:", e);
  }
};

// ✅ Get all chats
export const getChats = () => {
  const result = db.execute(
    `SELECT * FROM chats ORDER BY updatedAt DESC`
  );

  return result.rows?._array || [];
};

// ✅ Save message
export const saveMessage = async (
  msg: any,
  syncToFirestore: boolean = true
) => {
  db.execute(
    `INSERT OR IGNORE INTO messages
     (id, chatId, text, sender, createdAt, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [msg.id, msg.chatId, msg.text, msg.sender, Date.now(), "sent"]
  );

    if (syncToFirestore) {
      try {
        await FirestoreService.saveMessage(
          msg.chatId,
          msg
        );
      } catch (e) {
        console.log(e);
      }
    }

  updateChatAfterMessage(msg.chatId, msg.text);

  if (msg.sender === "user") {
    await updateChatTitleIfFirstMessage(
      msg.chatId,
      msg.text
    );
  }
};

// ✅ Update chat last message
export const updateChatAfterMessage = (chatId: string, text: string) => {
  db.execute(
    `UPDATE chats SET lastMessage=?, updatedAt=? WHERE id=?`,
    [text, Date.now(), chatId]
  );
};

// ✅ Get messages of a chat (🔥 FIX APPLIED HERE)
export const getMessages = (chatId: string) => {
  const result = db.execute(
    `SELECT * FROM messages WHERE chatId=? ORDER BY createdAt ASC`,
    [chatId]
  );

  const rows = result.rows?._array || [];

  // 🔥 Parse structured responses back into objects
  const parsed = rows.map((msg: any) => {
    if (msg.sender === 'bot') {
      try {
        const parsedText = JSON.parse(msg.text);

        return {
          ...msg,
          data: parsedText.data ?? parsedText, // 👈 backward compatible
          mode: parsedText.mode ?? 'basic',    // 👈 KEY FIX
        };
      } catch {
        return msg;
      }
    }
    return msg;
  });

  return parsed;
};

// change the name to users first message
export const updateChatTitleIfFirstMessage = async (
  chatId: string,
  text: string
) => {
  const title = text.slice(0, 30);

  db.execute(
    `UPDATE chats
     SET title=?
     WHERE id=? AND title='New Chat'`,
    [title, chatId]
  );

  try {
    await FirestoreService.renameChat(
      chatId,
      title
    );
  } catch (e) {
    console.log(e);
  }
};

// delete chats
export const deleteChat = async (chatId: string) => {
  db.execute(
    `DELETE FROM messages WHERE chatId=?`,
    [chatId]
  );

  db.execute(
    `DELETE FROM chats WHERE id=?`,
    [chatId]
  );

  try {
    await FirestoreService.deleteChat(chatId);
  } catch (e) {
    console.log("Firestore deleteChat failed:", e);
  }
};

// rename query
export const renameChat = async (
  chatId: string,
  newTitle: string
) => {
  db.execute(
    `UPDATE chats SET title=? WHERE id=?`,
    [newTitle, chatId]
  );

  try {
    await FirestoreService.renameChat(
      chatId,
      newTitle
    );
  } catch (e) {
    console.log("Firestore renameChat failed:", e);
  }
};

// helper functions
export const chatExists = (chatId: string) => {
  const result = db.execute(
    `SELECT id FROM chats WHERE id=?`,
    [chatId]
  );

  return (result.rows?._array.length ?? 0) > 0;
};

export const messageExists = (messageId: string) => {
  const result = db.execute(
    `SELECT id FROM messages WHERE id=?`,
    [messageId]
  );

  return (result.rows?._array.length ?? 0) > 0;
};