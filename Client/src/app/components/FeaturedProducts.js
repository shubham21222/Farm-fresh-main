export default function FeaturedProducts() {
    const products = [
      { name: 'Fresh Bananas', price: '$1.99', image: '/images/banana.jpg' },
      { name: 'Organic Tomatoes', price: '$2.15', image: '/images/tomato.jpg' },
      { name: 'Juicy Oranges', price: '$2.30', image: '/images/orange.jpg' },
      { name: 'Red Apples', price: '$1.80', image: '/images/apple.jpg' },
    ];
  
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div key={index} className="border rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.price}</p>
                <button className="mt-4 bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500">Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }