export const isEmail = (email) => /\S+@\S+\.\S+/.test(email);
export const isPassword = (password) => password && password.length >= 6;
export const isRequired = (value) => value !== undefined && value !== null && value !== '';
