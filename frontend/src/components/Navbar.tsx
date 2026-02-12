import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, LogOut, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Product Logo (Box Icon) */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <Package className="h-5 w-5 text-[#10b981]" /> {/* Green color to match image_09cbfd.png */}
          ProductHub
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="mr-1 h-4 w-4" /> Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/products">Products</Link>
              </Button>
              <div className="flex items-center gap-2 ml-2">
                {/* Fixed: user.name ko user.fullname kiya */}
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.fullname}
                </span>
                {isAdmin && <Badge variant="default" className="text-[10px] px-1.5 py-0">Admin</Badge>}
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="bg-[#10b981] hover:bg-[#059669]">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;