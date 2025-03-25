import { NextResponse } from 'next/server';

// Mock farmer data - in a real app, this would come from a database
const mockFarmer = {
  id: "1",
  name: "John Doe",
  banner: "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=1260",
  avatar: "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=600",
  description: "Passionate about sustainable farming and organic produce. We specialize in growing the finest organic vegetables using traditional farming methods combined with modern sustainable practices.",
  categories: ["Organic", "Vegetables", "Sustainable", "Local"],
  rating: 4.8,
  totalReviews: 127,
  products: [
    {
      id: "p1",
      name: "Fresh Organic Tomatoes",
      image: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600",
      price: 4.99
    },
    {
      id: "p2",
      name: "Organic Lettuce",
      image: "https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg?auto=compress&cs=tinysrgb&w=600",
      price: 2.99
    },
    {
      id: "p3",
      name: "Farm Fresh Carrots",
      image: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=600",
      price: 3.49
    }
  ],
  reviews: [
    {
      id: "r1",
      user: "Sarah M.",
      rating: 5,
      comment: "The best organic vegetables I've ever had! The tomatoes are incredibly flavorful.",
      date: "2 days ago"
    },
    {
      id: "r2",
      user: "Mike R.",
      rating: 4,
      comment: "Great quality produce and excellent customer service. Will definitely buy again!",
      date: "1 week ago"
    },
    {
      id: "r3",
      user: "Emily L.",
      rating: 5,
      comment: "Love supporting local farmers. The organic lettuce is always fresh and crisp.",
      date: "2 weeks ago"
    }
  ]
};

export async function GET(request, { params }) {
  try {
    // In a real app, you would fetch data from a database using params.id
    // For now, we'll return mock data
    return NextResponse.json(mockFarmer);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch farmer data' },
      { status: 500 }
    );
  }
} 