import TokenService from "../services/TokenService";
import config from "../config";

class AuthApi {
  // userData = { email, password, reppassword }
  static async signin(userData) {
    const res = await fetch(`${config.API_ADDRES}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });

    let resData;

    try {
      resData = await res.json();
    } catch {
      resData = {};
    }

    if (!res.ok) {
      return {
        success: false,
        message: resData?.message,
      };
    }

    return {
      success: true,
      token: resData.token,
    };
  }

  static async register(userData) {
    const res = await fetch(`${config.API_ADDRES}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });

    let resData;

    try {
      resData = await res.json();
    } catch {
      resData = {};
    }

    if (!res.ok) {
      return {
        success: false,
        message: resData?.message,
      };
    }

    return {
      success: true,
    };
  }

  static async checkAuth() {
    const token = TokenService.getToken();
    const res = await fetch(`${config.API_ADDRES}/auth/checkauth`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.ok;
  }
}

export default AuthApi;
