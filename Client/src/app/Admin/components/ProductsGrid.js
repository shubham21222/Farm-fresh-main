import Image from 'next/image';
import { Package, Tag, ShoppingCart } from 'lucide-react';

const ProductsGrid = ({ products = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Package className="h-5 w-5 mr-2 text-gray-600" />
          Recent Products
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
              <div className="relative h-32 w-full rounded-t-lg overflow-hidden bg-gray-100">
                <Image
                  src={product.image || 'https://via.placeholder.com/300?text=No+Image'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-800 truncate" title={product.name}>
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="h-4 w-4 mr-1" />
                    ₹{product.price}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {product.stock}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 truncate" title={product.farmer?.farmName}>
                  {product.farmer?.farmName || 'Unknown Farm'}
                </div>
              </div>
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products available
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsGrid; 