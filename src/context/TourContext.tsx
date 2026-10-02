import { createContext, useContext, useState, type ReactNode } from "react";

type TourContextValue = {
  isOpen: boolean;
  step: number;
  start: () => void;
  close: (completed?: boolean) => void;
  goTo: (step: number) => void;
};
const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const start = () => {
    setStep(0);
    setIsOpen(true);
  };
  const close = (_completed = true) => {
    setIsOpen(false);
    if (typeof window !== "undefined")
      window.localStorage.setItem("mitraskill_tour_completed", "true");
  };
  const goTo = (next: number) => setStep(Math.max(0, Math.min(5, next)));
  return (
    <TourContext.Provider value={{ isOpen, step, start, close, goTo }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) throw new Error("useTour must be used within TourProvider");
  return context;
}
