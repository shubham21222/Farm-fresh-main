export default function Categories() {
    const categories = [
      { name: 'Fruits', icon: '🍎' },
      { name: 'Vegetables', icon: '🥕' },
      { name: 'Citrus Fruits', icon: '🍊' },
    ];
  
    return (
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Fruits & Vegetable Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <span className="text-4xl mb-4">{category.icon}</span>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <button className="mt-4 bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500">More</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }