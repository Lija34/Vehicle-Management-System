export const isAuthenticated = () => {
  const token = document.cookie.includes('token');
  return { token };
};

export const getUserRole = () => {
  const roleCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('role='))
    ?.split('=')[1];
  return roleCookie || null;
};
