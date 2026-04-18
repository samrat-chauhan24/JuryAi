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

// ✅ Get messages of a chat
export const getMessages = (chatId: string) => {
  const result = db.execute(
    `SELECT * FROM messages WHERE chatId=? ORDER BY createdAt ASC`,
    [chatId]
  );

  return result.rows?._array || [];
};

// change the name to users frist message
export const updateChatTitleIfFirstMessage = (
  chatId: string,
  text: string
) => {
  db.execute(
    `UPDATE chats 
     SET title=? 
     WHERE id=? AND title='New Chat'`,
    [text.slice(0, 30), chatId] // limit length
  );
};

// delete chats
export const deleteChat = (chatId: string) => {
  // delete messages first (important)
  db.execute(
    `DELETE FROM messages WHERE chatId=?`,
    [chatId]
  );

  // then delete chat
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