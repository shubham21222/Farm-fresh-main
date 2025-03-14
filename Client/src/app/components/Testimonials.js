export default function Testimonials() {
    const testimonial = {
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      author: "Tamara Smith",
      image: '/images/testimonial.jpg',
    };
  
    return (
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">People Says About Agro</h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 italic mb-4">{`"${testimonial.quote}"`}</p>
            <div className="flex items-center justify-center space-x-4">
              <img src={testimonial.image} alt={testimonial.author} className="w-12 h-12 rounded-full" />
              <span className="font-semibold">{testimonial.author}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }