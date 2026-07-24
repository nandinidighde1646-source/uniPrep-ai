export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (data: LoginResponse) => void;
  logout: () => void;
}