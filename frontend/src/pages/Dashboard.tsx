import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllProducts } from "@/mock/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Tag, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({ total: 0, categories: 0, avgPrice: 0 });

  useEffect(() => {
    getAllProducts().then((res) => {
      if (res.products) {
        const cats = new Set(res.products.map((p) => p.category));
        const avg = res.products.reduce((s, p) => s + p.price, 0) / (res.products.length || 1);
        setStats({ total: res.products.length, categories: cats.size, avgPrice: Math.round(avg * 100) / 100 });
      }
    });
  }, []);

  const cards = [
    { label: "Total Products", value: stats.total, icon: Package, color: "text-blue-500" },
    { label: "Categories", value: stats.categories, icon: Tag, color: "text-emerald-500" },
    { label: "Avg Price", value: `$${stats.avgPrice}`, icon: BarChart3, color: "text-amber-500" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin ? (
            <>You're logged in as <Badge className="text-[10px] px-1.5 py-0">Admin</Badge> — you can manage all products.</>
          ) : (
            "Browse products and explore our catalog."
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdmin && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShoppingCart className="h-5 w-5" /> Admin Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Head to the <a href="/products" className="text-primary underline">Products</a> page to create, edit, or delete products.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
