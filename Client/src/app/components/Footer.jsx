import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { title: "About Us", links: ["Our Story", "Farmers", "Careers"] },
            { title: "Help", links: ["FAQs", "Shipping", "Returns"] },
            { title: "Shop", links: ["All Products", "Fresh Fruits", "Vegetables"] },
            { title: "Contact", links: ["Contact Us", "Support", "Partners"] },
          ].map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Agro Market. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;