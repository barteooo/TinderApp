import TokenService from "../services/TokenService";
import config from "../config";

class MessagesApi {
  static async getMessages(matchedUserId) {
    const token = TokenService.getToken();
    const res = await fetch(
      `${config.API_ADDRES}/messages/matched/${matchedUserId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      return {
        success: false,
      };
    }

    const data = await res.json();
    return {
      success: true,
      messages: data.messages,
    };
  }
}

export default MessagesApi;
