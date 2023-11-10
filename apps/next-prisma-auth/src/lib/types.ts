export interface FilteredAuthData {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthDataResponse {
  status: string;
  data: {
    user: FilteredAuthData;
  };
}

export interface LoginResponse {
  status: string;
  token: string;
}
