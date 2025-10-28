import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  const categoryLabels = {
    all: "All Items",
    appetizers: "Appetizers", 
    mains: "Main Courses",
    desserts: "Desserts",
    drinks: "Beverages"
  };

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {["all", ...categories].map((category) => (
        <motion.button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "px-6 py-3 rounded-full font-medium transition-all duration-200",
            activeCategory === category
              ? "bg-primary text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layout
        >
          {categoryLabels[category] || category}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;