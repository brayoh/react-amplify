const jwtDecode = require('jwt-decode');

/**
 * helper method to validate  user token
 *
 * @param {*} token
 * @returns {boolean}
 */
export const validateToken = (token: any): boolean => {
  if (!token) {
    return false;
  }
  try {
    const decodedJwt: any = jwtDecode(token);
    return decodedJwt.exp >= Date.now() / 1000;
  } catch (e) {
    return false;
  }
};
