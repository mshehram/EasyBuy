import { getProducts } from "../../lib/getProducts";
import Categories from "./Categories";
import Filter from "./Filter";
import ProductCard from "./ProductCard";

const ProductList = async ({ searchParams, params }: any) => {
  const products = await getProducts();
  console.log("All products:", products);

  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category || "all";
  console.log("Selected category:", category);

  const filteredProducts =
    category !== "all"
      ? products.filter(
          (product: any) =>{
                  console.log({
                    product,
                    'p_category':product.category,
                     category
                  })
            return product.category?.toLowerCase().includes(category.toLowerCase())
          }
        )
      : products;

  console.log("Filtered products:", filteredProducts);

  return (
    <div className="w-full">
      <Categories />
      {params === "products" && <Filter />}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {filteredProducts.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;