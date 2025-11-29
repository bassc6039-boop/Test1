import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found");
    }
    return new GoogleGenAI({ apiKey });
}

export const generateSmartDescription = async (userInput: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User input: "${userInput}".
      Task: Create a professional, short transaction description (max 6 words) for a payment gateway based on the user input.
      If the input is empty or nonsense, generate a generic "Order #..." description.
      Language: Russian.
      Output only the description string.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Заказ #${Math.floor(Math.random() * 10000)}`;
  }
};

export const generateReceiptNote = async (amount: number, item: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a polite, slightly witty thank you message for a payment receipt.
      Amount: ${amount} RUB.
      Item: ${item}.
      Language: Russian.
      Max length: 1 sentence.`,
    });
    return response.text.trim();
  } catch (error) {
      return "Спасибо за покупку!";
  }
};
