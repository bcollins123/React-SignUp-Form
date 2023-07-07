import { useEffect, useState } from "react";
import { getAccessToken, getCookie } from "../utils";

interface FetchDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

const useFetchData = <T,>(url: string): FetchDataResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
        setData(jsonData);
        setError(null);
      } catch (error: any) {
        setError(error.message);
      }

      setIsLoading(false);
    };

    if (url === "") {
      setError("Invalid API URL");
    } else {
      fetchData();
    }
  }, [url]);

  return { data, isLoading, error };
};

export default useFetchData;
