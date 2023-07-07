import { API_URL } from "./constants";

export const setCookie = (name: string, value: string, days: number): void => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);

  const cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookie;
};

export const getCookie = (name: string): string | null => {
  const cookieString = document.cookie;
  const cookies = cookieString.split(";");

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    const trimmedCookieName = cookieName.trim();

    if (trimmedCookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
};

export const getAccessToken = async () => {
  try {
    const response = await fetch(
      `${API_URL}/getaccesstoken`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "api-token": import.meta.env.VITE_API_TOKEN,
          "user-email": import.meta.env.VITE_USER_EMAIL,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const jsonData = await response.json();
    setCookie("auth_token", jsonData.auth_token, 1);
    return jsonData.auth_token;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchData = async (url: string) => {
  try {
    let authToken = getCookie("auth_token");
    if (!authToken) {
      authToken = await getAccessToken();
    }
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error: any) {
    console.log(error.message);
  }
};
