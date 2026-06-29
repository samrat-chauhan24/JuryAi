import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

class FirestoreService {
  // ======================================================
  // USER
  // ======================================================

  get uid() {
    const user = auth().currentUser;

    if (!user) {
      throw new Error("User is not logged in.");
    }

    return user.uid;
  }

  async createUser(name: string, email: string) {
    await firestore()
      .collection("users")
      .doc(this.uid)
      .set(
        {
          name,
          email,
          lastLogin: firestore.FieldValue.serverTimestamp(),
          createdAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
  }

  async updateLastLogin() {
    await firestore()
      .collection("users")
      .doc(this.uid)
      .set(
        {
          lastLogin: firestore.FieldValue.serverTimestamp(),
        },
        {
          merge: true,
        }
      );
  }

  // ======================================================
  // CHAT
  // ======================================================

  async createChat(chat: {
    id: string;
    title: string;
    mode: string;
    jurisdiction: string;
    countries: string[];
  }) {
    await firestore()
      .collection("users")
      .doc(this.uid)
      .collection("chats")
      .doc(chat.id)
      .set({
        ...chat,
        messageCount: 0,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  }

  async getChats() {
    const snapshot = await firestore()
      .collection("users")
      .doc(this.uid)
      .collection("chats")
      .orderBy("updatedAt", "desc")
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async renameChat(chatId: string, title: string) {
    await firestore()
      .collection("users")
      .doc(this.uid)
      .collection("chats")
      .doc(chatId)
      .update({
        title,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  }

  async deleteChat(chatId: string) {
    const messagesRef = firestore()
        .collection("users")
        .doc(this.uid)
        .collection("chats")
        .doc(chatId)
        .collection("messages");

    const messages = await messagesRef.get();

    for (const message of messages.docs) {
        await message.ref.delete();
    }

    await firestore()
        .collection("users")
        .doc(this.uid)
        .collection("chats")
        .doc(chatId)
        .delete();
    }

  // ======================================================
  // MESSAGES
  // ======================================================

  async saveMessage(chatId: string, message: any) {
    await firestore()
      .collection("users")
      .doc(this.uid)
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(message.id)
      .set({
        ...message,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    await firestore()
      .collection("users")
      .doc(this.uid)
      .collection("chats")
      .doc(chatId)
      .update({
        updatedAt: firestore.FieldValue.serverTimestamp(),
        messageCount: firestore.FieldValue.increment(1),
      });
  }

  async getMessages(chatId: string) {
    const snapshot = await firestore()
      .collection("users")
      .doc(this.uid)
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("createdAt", "asc")
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // ======================================================
  // HELPERS
  // ======================================================

  async chatExists(chatId: string) {
    const doc = await firestore()
      .collection("users")
      .doc(this.uid)
      .collection("chats")
      .doc(chatId)
      .get();

    return doc.exists;
  }

  async deleteAllChats() {
    const chats = await firestore()
        .collection("users")
        .doc(this.uid)
        .collection("chats")
        .get();

    for (const chat of chats.docs) {
        await this.deleteChat(chat.id);
    }
    }
}

export default new FirestoreService();