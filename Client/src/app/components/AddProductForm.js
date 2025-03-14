'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Fruits',
    image: '',
    stock: '',
    unit: 'piece',
    isOrganic: true,
    isAvailable: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/products', {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
      toast.success('Product added successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Fruits',
        image: '',
        stock: '',
        unit: 'piece',
        isOrganic: true,
        isAvailable: true
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Dairy">Dairy</option>
          <option value="Grains">Grains</option>
          <option value="Meat">Meat</option>
          <option value="Other">Other</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input
          id="stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="unit">Unit</Label>
        <Select
          id="unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          required
        >
          <option value="piece">Piece</option>
          <option value="kg">Kilogram</option>
          <option value="g">Gram</option>
          <option value="dozen">Dozen</option>
          <option value="litre">Litre</option>
          <option value="ml">Millilitre</option>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isOrganic"
          name="isOrganic"
          checked={formData.isOrganic}
          onChange={handleChange}
        />
        <Label htmlFor="isOrganic">Organic</Label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isAvailable"
          name="isAvailable"
          checked={formData.isAvailable}
          onChange={handleChange}
        />
        <Label htmlFor="isAvailable">Available</Label>
      </div>

      <Button type="submit" className="w-full">
        Add Product
      </Button>
    </form>
  );
} 