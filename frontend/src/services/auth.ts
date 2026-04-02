export const setToken = (token: string) => {
  localStorage.setItem('jwtToken', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('jwtToken');
};

export const removeToken = () => {
  localStorage.removeItem('jwtToken');
};

export const setUserRole = (role: 'student' | 'faculty') => {
  localStorage.setItem('userRole', role);
};

export const getUserRole = (): string | null => {
  return localStorage.getItem('userRole');
};

export const removeUserRole = () => {
  localStorage.removeItem('userRole');
};

export const setUserInfo = (userInfo: any) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

export const getUserInfo = (): any | null => {
  const info = localStorage.getItem('userInfo');
  return info ? JSON.parse(info) : null;
};

export const removeUserInfo = () => {
  localStorage.removeItem('userInfo');
};

export const clearAuth = () => {
  removeToken();
  removeUserRole();
  removeUserInfo();
};
