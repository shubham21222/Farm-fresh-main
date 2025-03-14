"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FilterSection = ({ setCategoryFilter }) => {
  const categories = ["All", "fruits", "vegetables"];
  const badges = ["All", "Sale", "New", "Popular"];
  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "name-a-z", label: "Name: A to Z" },
    { value: "name-z-a", label: "Name: Z to A" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBadge, setSelectedBadge] = useState("All");
  const [selectedSort, setSelectedSort] = useState("default");

  const applyFilters = (category, badge, sort) => {
    const filters = {
      category: category === "All" ? null : category,
      badge: badge === "All" ? null : badge,
      sort: sort,
    };
    setCategoryFilter(filters);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applyFilters(category, selectedBadge, selectedSort);
  };

  const handleBadgeChange = (badge) => {
    setSelectedBadge(badge);
    applyFilters(selectedCategory, badge, selectedSort);
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
    applyFilters(selectedCategory, selectedBadge, sort);
  };

  return (
    <div className="flex justify-between items-center flex-wrap gap-6 mb-8 p-4 bg-green-50 rounded-lg shadow-md">
      {/* Category Filter */}
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-green-700">Category:</span>
        <div className="flex gap-2">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "text-green-600 border-green-600 hover:bg-green-100"
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Badge Filter */}
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-green-700">Badge:</span>
        <div className="flex gap-2">
          {badges.map((badge, index) => (
            <Button
              key={index}
              variant={selectedBadge === badge ? "default" : "outline"}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedBadge === badge
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "text-green-600 border-green-600 hover:bg-green-100"
              }`}
              onClick={() => handleBadgeChange(badge)}
            >
              {badge}
            </Button>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-green-700">Sort by:</span>
        <Select onValueChange={handleSortChange} value={selectedSort}>
          <SelectTrigger className="w-[200px] bg-white border-green-600 text-green-700 rounded-full focus:ring-2 focus:ring-green-500">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white border-green-600 rounded-lg">
            {sortOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-green-700 hover:bg-green-100"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterSection;