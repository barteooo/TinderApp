import TokenService from "../services/TokenService";
import config from "../config";

class UsersApi {
  // userData = { email, password, reppassword }
  static async updateCurrent(userData) {
    const token = TokenService.getToken();

    const res = await fetch(`${config.API_ADDRES}/users/current`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...userData }),
    });

    if (!res.ok) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  }

  static async addMatch(userId) {
    const token = TokenService.getToken();

    const res = await fetch(`${config.API_ADDRES}/users/addmatch/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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
      isMatch: data.isMatch,
    };
  }

  static async addNotMatch(userId) {
    const token = TokenService.getToken();

    const res = await fetch(
      `${config.API_ADDRES}/users/addnotmatch/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  }

  static async getCurrentUser() {
    const token = TokenService.getToken();
    const res = await fetch(`${config.API_ADDRES}/users/current`, {
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
      user: {
        ...data.user,
      },
    };
  }

  static async getInterestUsers() {
    const token = TokenService.getToken();
    const res = await fetch(`${config.API_ADDRES}/users/interest`, {
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
      users: data.users,
    };
  }

  static async getMatchedUsers() {
    const token = TokenService.getToken();
    const res = await fetch(`${config.API_ADDRES}/users/matches`, {
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
      users: data.users,
    };
  }

  static async getOne(id) {
    const token = TokenService.getToken();
    const res = await fetch(`${config.API_ADDRES}/users/one/${id}`, {
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
      user: data.user,
    };
  }

  static async deleteCurrentUser() {
    const token = TokenService.getToken();
    const res = await fetch(`${config.API_ADDRES}/users/current`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  }

  static async deleteMatch(id) {
    const token = TokenService.getToken();
    const res = await fetch(`${config.API_ADDRES}/users/match/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  }

  static async importProfileFile(file) {
    const token = TokenService.getToken();

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${config.API_ADDRES}/users/profilefile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  }
}

export default UsersApi;
