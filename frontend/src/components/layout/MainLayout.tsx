import type { ReactNode } from "react";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container py-6">
        <Navigation />
      </div>
      <main className="container flex-1 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
