import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname === "/") return "home";
    if (location.pathname.startsWith("/books")) return "books";
    if (location.pathname.startsWith("/tests")) return "tests";
    return "home";
  };

  return (
    <Tabs value={getActiveTab()} className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="home" onClick={() => navigate("/")}>
          Home
        </TabsTrigger>
        <TabsTrigger value="books" onClick={() => navigate("/books")}>
          Books
        </TabsTrigger>
        <TabsTrigger value="tests" onClick={() => navigate("/tests")}>
          Tests
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
