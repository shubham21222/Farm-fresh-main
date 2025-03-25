import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Replace with actual database query
    const farmer = {
      id: params.id,
      name: "John's Farm",
      banner: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3",
      avatar: "https://images.unsplash.com/photo-1560343776-97e7d202ff0e?ixlib=rb-4.0.3",
      description: "We are a family-owned farm specializing in organic produce and sustainable farming practices.",
      categories: ["Organic", "Vegetables", "Fruits", "Free Range"],
      rating: 4.8,
      totalReviews: 127,
      products: [
        {
          id: 1,
          name: "Fresh Tomatoes",
          image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3",
          price: 4.99
        },
        {
          id: 2,
          name: "Organic Carrots",
          image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3",
          price: 3.99
        },
        {
          id: 3,
          name: "Green Lettuce",
          image: "https://images.unsplash.com/photo-1622205313162-be1d5712a43c?ixlib=rb-4.0.3",
          price: 2.99
        }
      ],
      reviews: [
        {
          id: 1,
          user: "Sarah M.",
          rating: 5,
          comment: "Amazing fresh produce and great service!",
          date: "2024-03-15"
        },
        {
          id: 2,
          user: "Michael R.",
          rating: 4,
          comment: "Quality products, though prices are a bit high",
          date: "2024-03-10"
        },
        {
          id: 3,
          user: "Emma L.",
          rating: 5,
          comment: "Love the organic selection and friendly service",
          date: "2024-03-05"
        }
      ]
    };

    return NextResponse.json(farmer);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch farmer data" },
      { status: 500 }
    );
  }
} 