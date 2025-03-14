export default function BlogPosts() {
    const posts = [
      { title: 'Tips for Keeping Your Fruit Fresh', image: '/images/fruit-tips.jpg' },
      { title: 'Health Benefits of a New Fruit', image: '/images/fruit-health.jpg' },
      { title: 'Superfoods You Should Be Eating', image: '/images/superfoods.jpg' },
    ];
  
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Blog Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded mb-4" />
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <button className="mt-4 bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500">Read More</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }