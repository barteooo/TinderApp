class TokenService {
  static getToken() {
    return localStorage.getItem("token");
  }

  static setToken(token) {
    localStorage.setItem("token", token);
  }

  static removeToken() {
    localStorage.removeItem("token");
  }

  static tokenExists() {
    return this.getToken() ? true : false;
  }
}

export default TokenService;
