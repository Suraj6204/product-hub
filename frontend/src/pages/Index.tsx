import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Package className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">ProductHub</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A product management app — admins create &amp; manage products, users browse the catalog.
        </p>
        {user ? (
          <Button asChild size="lg">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <div className="flex justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
