import { Platform } from "react-native";

const MAC_IP = "10.23.184.30";

const API_BASE_URL =
  Platform.OS === "android"
    ? `http://${MAC_IP}:8000`
    : "http://localhost:8000";

export type ChatRequest = {
  query: string;
  jurisdiction: string;
  countries: string[];
  mode: string;
};

export const sendMessageToAI = async (
  payload: ChatRequest
) => {
  const url = `${API_BASE_URL}/chat`;

  console.log("📤 JURYAI BACKEND REQUEST:", {
    url,
    payload,
  });

  try {
    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.log("❌ JURYAI BACKEND ERROR:", {
        status: response.status,
        body: responseText,
      });

      throw new Error(
        `Backend request failed: ${response.status}`
      );
    }

    if (!responseText.trim()) {
      throw new Error(
        "Backend returned an empty response."
      );
    }

    const data = JSON.parse(responseText);

    console.log(
      "✅ JURYAI BACKEND RESPONSE:",
      data
    );

    return data;
  } catch (error) {
    console.log(
      "❌ JURYAI NETWORK ERROR:",
      error
    );

    throw error;
  }
};