import { useEffect } from "react";
import { getAuthData } from "@/lib/apiHelpers";
import useStore from "@/store";

export default function useSession() {
  const store = useStore();

  async function fetchUser() {
    try {
      const data = await getAuthData();
      store.setAuthData(data);
    } catch (error: any) {
      store.reset();
    }
  }

  useEffect(() => {
    if (!store.authData) {
      fetchUser();
    }
  }, []);

  return store.authData;
}
