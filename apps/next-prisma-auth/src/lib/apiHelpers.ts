import toast from "react-hot-toast";
import { FilteredAuthData, LoginResponse, AuthDataResponse } from "./types";

const API_ENDPOINT = process.env.API_ENDPOINT || "http://localhost:3000";

export async function getAuthData(token?: string): Promise<FilteredAuthData> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_ENDPOINT}/api/user/me`, {
    method: "GET",
    credentials: "include",
    headers: attachTokenHeader(headers, token),
  });

  return handleResponse<AuthDataResponse>(response).then(
    (data) => data.data.user
  );
}

export async function login(credentials: string): Promise<string> {
  const response = await fetch(`${API_ENDPOINT}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: credentials,
  });

  return handleResponse<LoginResponse>(response).then((data) => data.token);
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_ENDPOINT}/api/auth/logout`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<void>(response);
}

export async function register(credentials: string): Promise<FilteredAuthData> {
  const response = await fetch(`${API_ENDPOINT}/api/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: credentials,
  });

  return handleResponse<AuthDataResponse>(response).then(
    (data) => data.data.user
  );
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (isJson && data.errors !== null) {
      throw new Error(JSON.stringify(data.errors));
    }

    throw new Error(data.message || response.statusText);
  }

  return data as T;
}

function attachTokenHeader(headers: Record<string, string>, token?: string) {
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export function handleApiError(error: any): void {
  if (!(error instanceof Error)) {
    toast.error(error.message);
  }

  try {
    const errorData = JSON.parse(error.message);

    if (
      typeof errorData === "object" &&
      errorData !== null &&
      "fieldErrors" in errorData
    ) {
      const fieldErrors = errorData.fieldErrors as Record<string, string[]>;
      Object.keys(fieldErrors).forEach((fieldName) => {
        const validationErrors = fieldErrors[fieldName];
        if (validationErrors.length > 0) {
          const firstMessage = validationErrors[0];
          toast.error(firstMessage);
        }
      });
    }
  } catch (error: any) {
    toast.error(error);
  }
}
