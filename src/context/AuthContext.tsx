import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// I extracted the profile table from my supabase so typescript
// can build an inteface at the background to work with instead
// of manually creating one.
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// I created an instance that defines what AuthContext will contain
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile data:", error.message);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Unexpectede error:", err);
    } finally {
      setLoading(false);
    }
  };

  //   What happens when a user opens or click on refresh
  useEffect(() => {
    const initializedAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };

    initializedAuth();

    // listen to a live state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //   logs out user
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("usedAuth must be used within an AuthProvider");
  }
  return context;
};
