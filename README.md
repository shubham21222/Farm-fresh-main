# FarmFresh - Inventory Management System

A comprehensive inventory management system for farmers and agricultural businesses.

## Features

- User authentication and authorization
- Product management
- Order processing
- Inventory tracking
- Subscription management
- Delivery tracking
- Return management
- Loyalty program
- Analytics dashboard
- SMS and email notifications

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Twilio (SMS)
- Redis (Caching)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis (optional)
- Twilio account (for SMS)
- SMTP server (for emails)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Azure8230/inventory-management.git
cd inventory-management
```

2. Install dependencies:
```bash
cd Server
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
- MongoDB connection string
- JWT secret
- Email settings
- Twilio credentials
- Other necessary configurations

5. Start the development server:
```bash
npm run dev
```

## API Documentation

The API documentation is available at `/api-docs` when the server is running.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please contact the repository owner. 