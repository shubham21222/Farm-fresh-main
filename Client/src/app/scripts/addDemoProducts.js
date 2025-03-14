import api from '../lib/api';

const demoProducts = [
  {
    name: 'Fresh Organic Apples',
    description: 'Sweet and juicy organic apples from local farms',
    price: 4.99,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    stock: 50,
    unit: 'piece',
    isOrganic: true,
    isAvailable: true
  },
  {
    name: 'Organic Carrots',
    description: 'Fresh organic carrots packed with nutrients',
    price: 3.99,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    stock: 75,
    unit: 'kg',
    isOrganic: true,
    isAvailable: true
  },
  {
    name: 'Organic Milk',
    description: 'Farm-fresh organic milk from grass-fed cows',
    price: 5.99,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    stock: 30,
    unit: 'litre',
    isOrganic: true,
    isAvailable: true
  },
  {
    name: 'Organic Brown Rice',
    description: 'Whole grain organic brown rice',
    price: 8.99,
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    stock: 100,
    unit: 'kg',
    isOrganic: true,
    isAvailable: true
  }
];

const addDemoProducts = async () => {
  try {
    // First, login as a farmer
    const loginResponse = await api.post('/users/login', {
      email: 'farmer@example.com', // Replace with your farmer's email
      password: 'password123' // Replace with your farmer's password
    });

    // Set the token in localStorage
    localStorage.setItem('token', loginResponse.data.token);

    // Add each product
    for (const product of demoProducts) {
      try {
        const response = await api.post('/products', product);
        console.log(`Added product: ${product.name}`);
      } catch (error) {
        console.error(`Error adding product ${product.name}:`, error.response?.data || error.message);
      }
    }

    console.log('Finished adding demo products');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

// Run the script
addDemoProducts(); 