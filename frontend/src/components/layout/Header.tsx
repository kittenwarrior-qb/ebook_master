import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme/ThemeToggle";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="font-display text-base md:text-xl font-semibold truncate">
            BookMaster
          </span>
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-1 md:gap-2">
          <Button
            variant={"ghost"}
            size="sm"
            onClick={() => navigate("/books")}
            className="gap-2"
          >
            <span className="hidden sm:inline">Books</span>
          </Button>
          <Button
            variant={"ghost"}
            size="sm"
            onClick={() => navigate("/tests")}
            className="gap-2"
          >
            <span className="hidden sm:inline">Tests</span>
          </Button>
          
        </nav>
          <ThemeToggle />
      </div>
    </header>
  );
}
