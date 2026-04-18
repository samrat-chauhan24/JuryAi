import { open } from 'react-native-quick-sqlite';

export const db = open({
  name: 'chat.db',
});

export const initDB = async () => {
  try {
    db.execute(`
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        title TEXT,
        lastMessage TEXT,
        updatedAt INTEGER,
        createdAt INTEGER
      );
    `);

    db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        chatId TEXT,
        text TEXT,
        sender TEXT,
        createdAt INTEGER,
        status TEXT
      );
    `);

    db.execute(
      `CREATE INDEX IF NOT EXISTS idx_messages_chatId ON messages(chatId);`
    );

    db.execute(
      `CREATE INDEX IF NOT EXISTS idx_chats_updatedAt ON chats(updatedAt);`
    );

    console.log('DB initialized ✅');
  } catch (e) {
    console.log('DB init failed ❌', e);
  }
};