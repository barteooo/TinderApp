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
      chatData: data.chatData,
    };
  }

  static deleteMessage(chatId, messageId) {
    const token = TokenService.getToken();

    return new Promise((resolve, reject) => {
      fetch(`${config.API_ADDRES}/messages`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, messageId }),
      }).then((res) => {
        if (!res.ok) {
          resolve({ success: false });
          return;
        }

        resolve({ success: true });
      });
    });
  }

  static updateMessage(chatId, messageId, text) {
    const token = TokenService.getToken();

    return new Promise((resolve, reject) => {
      fetch(`${config.API_ADDRES}/messages`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, messageId, text }),
      }).then((res) => {
        if (!res.ok) {
          resolve({ success: false });
          return;
        }

        resolve({ success: true });
      });
    });
  }

  static async getStats(userId) {
    const token = TokenService.getToken();

    const res = await fetch(`${config.API_ADDRES}/messages/stats/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return {
        success: false,
      };
    }

    const data = await res.json();
    return {
      success: true,
      stats: data.stats,
    };
  }
}

export default MessagesApi;
