import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllProducts } from "@/hooks/useGetAllProducts";
import { useGetProductById } from "@/hooks/useGetProductById";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import { useUpdateProduct } from "@/hooks/useUpdateProduct";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";

const emptyForm = { name: "", description: "", price: "", category: "" };

const Products = () => {
  const { isAdmin, user } = useAuth();
  
  // Custom Hooks ka use
  const { data, loading, refresh } = useGetAllProducts();
  const { createProduct, loading: creating } = useCreateProduct();
  const { updateProduct, loading: updating } = useUpdateProduct();
  const { deleteProduct, loading: deleting } = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Filter logic (using data from hook)
  const filtered = (data?.products || []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: String(p.price), category: p.category });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    
    const productData = { 
        name: form.name, 
        description: form.description, 
        price: Number(form.price), 
        category: form.category 
    };

    let res;
    if (editing) {
      // updateProduct hook use kiya
      res = await updateProduct(editing._id, productData); 
    } else {
      // createProduct hook use kiya
      res = await createProduct(productData, user?._id || ""); 
    }

    if (res.success) {
      toast({ title: editing ? "Product updated" : "Product created", description: res.message });
      setDialogOpen(false);
      refresh(); // Data reload karne ke liye
    } else {
      toast({ title: "Error", description: res.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    const res = await deleteProduct(id);
    if (res.success) {
      toast({ title: "Deleted", description: res.message });
      refresh();
    } else {
      toast({ title: "Error", description: res.message, variant: "destructive" });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {isAdmin && (
            <Button onClick={openCreate} size="sm">
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">No products found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            // Link ko card ke bahar le aayein aur styling ke liye block banayein
            <Link to={`/products/${p._id}`} key={p._id} className="block no-underline">
              <Card className="flex flex-col h-full transition-shadow hover:shadow-md cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight">{p.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">{p.category}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                </CardContent>

                <CardFooter className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                  <span className="text-xl font-bold">${p.price.toFixed(2)}</span>
                  
                  {/* Admin buttons mein e.stopPropagation() zaroori hai takki 
                      delete click karne par detail page na khul jaye */}
                  {isAdmin && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); openEdit(p); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive" 
                        onClick={(e) => { e.preventDefault(); handleDelete(p._id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={creating || updating}>Cancel</Button>
            <Button onClick={handleSave} disabled={creating || updating}>
              {(creating || updating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;