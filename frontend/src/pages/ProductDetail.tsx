import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// Mock API ko hata kar hook import kiya
import { useGetProductById } from "@/hooks/useGetProductById"; 
import { Product } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

const ProductDetail = () => {
  // useParams se id nikalna
  const { id } = useParams<{ id: string }>(); 
  const [product, setProduct] = useState<Product | null>(null);
  
  // Custom hook use kiya
  const { getProductById, loading } = useGetProductById(); 

  useEffect(() => {
    if (!id) return;
    
    // Real backend se product fetch karna
    getProductById(id).then((res) => {
      if (res.product) {
        setProduct(res.product);
      }
      if (res.cached) {
        console.log("[Redis Cache] Product served from cache");
      }
    });
  }, [id]);

  // Hook ki loading state use ho rahi hai
  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  if (!product) return (
    <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted-foreground">
      Product not found.
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/products"><ArrowLeft className="mr-1 h-4 w-4" /> Back to Products</Link>
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            {/* Updated property 'name' use kiya */}
            <CardTitle className="text-2xl">{product.name}</CardTitle> 
            <Badge variant="secondary">{product.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{product.description}</p>
          <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
          <div className="text-xs text-muted-foreground space-y-1">
            {/* Timestamps handle ho rahe hain */}
            <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(product.updatedAt).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;