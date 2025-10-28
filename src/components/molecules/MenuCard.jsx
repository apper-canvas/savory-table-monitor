import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const MenuCard = ({ item }) => {
  const getDietaryIcon = (tag) => {
    switch(tag) {
      case "vegetarian": return { icon: "Leaf", color: "text-green-600" };
      case "vegan": return { icon: "Sprout", color: "text-green-700" };
      case "gluten-free": return { icon: "WheatOff", color: "text-blue-600" };
      default: return null;
    }
  };

  return (
    <Card className="overflow-hidden group">
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {item.dietaryTags.length > 0 && (
          <div className="absolute top-3 right-3 flex gap-1">
            {item.dietaryTags.map((tag) => {
              const dietary = getDietaryIcon(tag);
              return dietary ? (
                <motion.div
                  key={tag}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                  whileHover={{ scale: 1.1 }}
                >
                  <ApperIcon name={dietary.icon} className={`w-4 h-4 ${dietary.color}`} />
                </motion.div>
              ) : null;
            })}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
            {item.name}
          </h3>
          <span className="text-xl font-bold text-primary">${item.price}</span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {item.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-accent capitalize bg-surface px-3 py-1 rounded-full">
            {item.category}
          </span>
          
          {!item.available && (
            <span className="text-xs font-medium text-error bg-red-50 px-3 py-1 rounded-full">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MenuCard;