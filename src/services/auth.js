import { request } from './__base';

export default class AuthService {
  static async signIn(email, password) {
    const url = `auth/login`;

    const response = await request({
      url,
      method: 'post',
      payload: {
        password,
        username_or_email: email,
      },
    });
    if (!response.data) return null;
    return response.data;
  }
}
