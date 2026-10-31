import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import api from "@/utils/api";
import type { MatchFilters, UserDetails } from "@/utils/interfaces";
import { formDefaultVals } from "@/utils/constants";
import { errorMessage } from "@/lib/errors";
import { remainingInterest } from "@/utils/utils";
import { isBroker } from "@/lib/session";

interface UserContextValue {
  user: UserDetails;
  loaded: boolean;
  setUser: (user: UserDetails) => void;
  refresh: () => Promise<UserDetails | null>;
  /** Active match filters (start from the member's partner preferences). */
  filters: MatchFilters | null;
  setFilters: (filters: MatchFilters) => void;
  remaining: number;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserDetails>(formDefaultVals as UserDetails);
  const [loaded, setLoaded] = useState(false);
  const [filters, setFilters] = useState<MatchFilters | null>(null);

  const setUser = useCallback((next: UserDetails) => {
    setUserState(next);
    setFilters((prev) => prev ?? { partner: next.partner ?? {}, sort: "best" });
  }, []);

  const refresh = useCallback(async () => {
    // Partners have no member profile; their pages load their own data.
    if (isBroker()) {
      setLoaded(true);
      return null;
    }
    try {
      const res = await api.get("/my-profile");
      setUser(res.data.profile);
      return res.data.profile as UserDetails;
    } catch (err) {
      toast.error("Couldn't load your profile", { description: errorMessage(err) });
      return null;
    } finally {
      setLoaded(true);
    }
  }, [setUser]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <UserContext.Provider
      value={{
        user,
        loaded,
        setUser,
        refresh,
        filters,
        setFilters,
        remaining: Math.max(0, remainingInterest(user)),
      }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
};
