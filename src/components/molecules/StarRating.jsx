import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StarRating = ({ rating, maxRating = 5, size = "w-5 h-5", showNumber = false }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <ApperIcon
            name="Star"
            className={`${size} ${
              index < rating 
                ? "text-accent fill-current" 
                : "text-gray-300"
            }`}
          />
        </motion.div>
      ))}
      {showNumber && (
        <span className="ml-2 text-sm font-medium text-gray-600">
          ({rating}/{maxRating})
        </span>
      )}
    </div>
  );
};

export default StarRating;