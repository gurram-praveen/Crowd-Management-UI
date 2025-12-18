import api from '../utils/api';

import { jwtDecode } from 'jwt-decode';
// import api from './api';

class AuthService {
  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);

    const token = response.data.token;
    if (!token) {
      throw new Error('Token missing in login response');
    }

    const decoded = jwtDecode(token);

    const user = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }

//   isAuthenticated() {
//     return !!this.getToken();
//   }

isAuthenticated() {
  const token = this.getToken();
  if (!token) return false;

  const { exp } = jwtDecode(token);
  return Date.now() < exp * 1000;
}


  getToken() {
    return localStorage.getItem('authToken');
  }
}

export default new AuthService();
