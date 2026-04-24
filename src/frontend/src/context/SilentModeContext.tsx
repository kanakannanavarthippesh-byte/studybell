import { type ReactNode, createContext, useContext, useState } from "react";

interface SilentModeContextValue {
  isSilent: boolean;
  toggleSilent: () => void;
}

const SilentModeContext = createContext<SilentModeContextValue>({
  isSilent: false,
  toggleSilent: () => {},
});

export function SilentModeProvider({ children }: { children: ReactNode }) {
  const [isSilent, setIsSilent] = useState(false);

  const toggleSilent = () => setIsSilent((prev) => !prev);

  return (
    <SilentModeContext.Provider value={{ isSilent, toggleSilent }}>
      {children}
    </SilentModeContext.Provider>
  );
}

export function useSilentMode(): SilentModeContextValue {
  return useContext(SilentModeContext);
}
