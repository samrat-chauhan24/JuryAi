import { db } from './db';

// ✅ Create new chat
export const createChat = (chatId: string) => {
  db.execute(
    `INSERT INTO chats (id, title, lastMessage, updatedAt, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    [chatId, 'New Chat', '', Date.now(), Date.now()]
  );
};

// ✅ Get all chats
export const getChats = () => {
  const result = db.execute(
    `SELECT * FROM chats ORDER BY updatedAt DESC`
  );

  return result.rows?._array || [];
};

// ✅ Save message
export const saveMessage = (msg: any) => {
  db.execute(
    `INSERT OR IGNORE INTO messages 
     (id, chatId, text, sender, createdAt, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [msg.id, msg.chatId, msg.text, msg.sender, Date.now(), 'sent']
  );

  // 🔥 update last message
  updateChatAfterMessage(msg.chatId, msg.text);

  // 🔥 update title ONLY for first user message
  if (msg.sender === 'user') {
    updateChatTitleIfFirstMessage(msg.chatId, msg.text);
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
export const updateChatTitleIfFirstMessage = (
  chatId: string,
  text: string
) => {
  db.execute(
    `UPDATE chats 
     SET title=? 
     WHERE id=? AND title='New Chat'`,
    [text.slice(0, 30), chatId]
  );
};

// delete chats
export const deleteChat = (chatId: string) => {
  db.execute(
    `DELETE FROM messages WHERE chatId=?`,
    [chatId]
  );

  db.execute(
    `DELETE FROM chats WHERE id=?`,
    [chatId]
  );
};

// rename query
export const renameChat = (chatId: string, newTitle: string) => {
  db.execute(
    `UPDATE chats SET title=? WHERE id=?`,
    [newTitle, chatId]
  );
};