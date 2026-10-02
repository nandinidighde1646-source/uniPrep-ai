import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import type { ReactNode } from "react";


type User = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};


type LoginData = {
  user: User;
  token: string;
};


type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (data: LoginData) => void;
  logout: () => void;
};


const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);



export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [user, setUser] = useState<User | null>(() => {

    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;

  });



  const [token, setToken] = useState<string | null>(() => {

    return localStorage.getItem("token");

  });



  const [loading, setLoading] = useState(true);



  // Restore authentication after page refresh
  useEffect(() => {

    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");


    if (storedToken && storedUser) {

      setToken(storedToken);
      setUser(JSON.parse(storedUser));

    }


    setLoading(false);

  }, []);




  // Login user
  const login = ({ user, token }: LoginData) => {

    console.log("LOGIN CALLED:", user);


    setUser(user);
    setToken(token);


    localStorage.setItem(
      "token",
      token
    );


    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

  };




  // Logout user
  const logout = () => {

    setUser(null);
    setToken(null);


    localStorage.removeItem("token");
    localStorage.removeItem("user");

  };




  const isAuthenticated = !!token;



  return (

    <AuthContext.Provider

      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
      }}

    >

      {children}

    </AuthContext.Provider>

  );

}





export function useAuth() {

  const context = useContext(AuthContext);


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }


  return context;

}