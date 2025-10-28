import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { menuService } from "@/services/api/menuService";
import MenuCard from "@/components/molecules/MenuCard";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const Menu = () => {
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDietaryTags, setSelectedDietaryTags] = useState([]);

  const categories = menuService.getCategories();
  const dietaryTags = menuService.getDietaryTags();

  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allItems, activeCategory, searchQuery, selectedDietaryTags]);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      setError("");
      const items = await menuService.getAll();
      setAllItems(items);
    } catch (err) {
      setError("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allItems];

    // Apply category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    // Apply dietary tags filter
    if (selectedDietaryTags.length > 0) {
      filtered = filtered.filter(item =>
        selectedDietaryTags.some(tag => item.dietaryTags.includes(tag))
      );
    }

    setFilteredItems(filtered);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const toggleDietaryTag = (tag) => {
    setSelectedDietaryTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setSelectedDietaryTags([]);
  };

  if (loading) return <Loading type="menu" />;
  if (error) return <Error message={error} onRetry={loadMenuItems} />;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-secondary mb-6">
            Our Menu
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our carefully crafted dishes made with the finest ingredients 
            and prepared with passion by our expert chefs
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-md mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search dishes by name or ingredient..."
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Dietary Tags Filter */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-700">Dietary preferences:</span>
            {dietaryTags.map(tag => (
              <motion.button
                key={tag}
                onClick={() => toggleDietaryTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedDietaryTags.includes(tag)
                    ? "bg-primary text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:border-primary"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* Active Filters & Clear */}
          {(activeCategory !== "all" || searchQuery || selectedDietaryTags.length > 0) && (
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="Filter" className="w-4 h-4" />
                <span>
                  Showing {filteredItems.length} of {allItems.length} items
                </span>
              </div>
              <button
                onClick={clearAllFilters}
                className="text-primary hover:text-accent text-sm font-medium transition-colors duration-200"
              >
                Clear all filters
              </button>
            </div>
          )}
        </motion.div>

        {/* Menu Items Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.Id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <MenuCard item={item} />
                </motion.div>
              ))}
            </div>
          ) : (
            <Empty
              title="No dishes found"
              description="Try adjusting your search or filters to find what you're looking for"
              icon="Search"
              action={
                <button
                  onClick={clearAllFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              }
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Menu;