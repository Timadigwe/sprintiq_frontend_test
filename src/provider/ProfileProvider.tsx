import { useWallet } from "@solana/wallet-adapter-react";
import { type PrismaProfile } from "@src/server/api/routers/auth";
import { api } from "@src/utils/api";
import { COOKIE_KEY } from "@src/utils/constants/constants";
import * as React from "react";
import { useCookies } from "react-cookie";
interface Profile {
  id: string;
  wallet_address: string;
  username: string;
  nonce: number;
  avatar_url: string | null;
  created_at: Date;
}
interface IProfileContext {
  currentProfile?: Profile | null;
  login: (address: string) => Promise<{ success?: boolean; user?: Profile }>;
  logout: (address?: string) => void;
  loginIn: boolean;
}

const DEFAULT_STATE: IProfileContext = {
  currentProfile: null,
  login: () => Promise.resolve({}),
  logout: (_address?: string) => null,
  loginIn: false,
};

const ProfileContext = React.createContext<IProfileContext>(DEFAULT_STATE);
interface ProfileProviderProps {
  currentProfile?: PrismaProfile | null;
  children: React.ReactNode;
}
const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
  currentProfile,
}) => {
  const [userContext, setUserContext] = React.useState({
    ...DEFAULT_STATE,
    currentProfile,
  });
  const { mutateAsync: handleLogin } = api.auth.login.useMutation();

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { disconnecting, disconnect } = useWallet();

  const [loginIn, setLoginIn] = React.useState(false);
  const [, , removeCookie] = useCookies([COOKIE_KEY]);

  const login = async (address: string) => {
    return handleLogin(address).then(res => {
      if (!res.success || res.error) {
        // TODO implement error toast
      }
      return res;
    });
  };
  const logout = async () => {
    if (disconnecting) return;
    await disconnect();
    removeCookie(COOKIE_KEY, {
      path: "/",
      secure:
        process.env.NODE_ENV === "production" ||
        process.env.NODE_ENV === "development",
    });
    setUserContext(() => ({
      ...userContext,
      currentProfile: null,
    }));
  };
  const context = {
    ...userContext,
    loginIn,
    setLoginIn,
    logout,
    login,
  };
  return (
    <ProfileContext.Provider value={context}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext, ProfileProvider };
