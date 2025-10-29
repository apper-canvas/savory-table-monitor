import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { menuService } from "@/services/api/menuService";
import { toast } from "react-toastify";
import MenuCard from "@/components/molecules/MenuCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

const MenuSection = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFeaturedItems();
  }, []);

  const loadFeaturedItems = async () => {
    try {
      setLoading(true);
      setError("");
      const items = await menuService.getAll();
      // Get featured items (first 3 items from different categories)
      const featured = items.filter(item => [1, 4, 8].includes(item.Id));
      setFeaturedItems(featured);
    } catch (err) {
      setError("Failed to load featured menu items");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="menu" />;
  if (error) return <Error message={error} onRetry={loadFeaturedItems} />;

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-display font-bold text-secondary mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Featured Dishes
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover our chef's carefully curated selection of signature dishes, 
            crafted with the finest ingredients and exceptional attention to detail
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.Id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              viewport={{ once: true }}
            >
              <MenuCard item={item} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Link to="/menu">
            <Button size="lg" className="px-8 py-4">
              <ApperIcon name="Menu" className="w-5 h-5 mr-2" />
              View Full Menu
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;