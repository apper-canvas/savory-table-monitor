import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface to-white px-4">
      <div className="text-center">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ApperIcon name="ChefHat" className="w-24 h-24 text-primary mx-auto mb-4" />
          <h1 className="text-6xl font-display font-bold text-secondary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like this dish isn't on our menu. Let's get you back to the table!
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/">
            <Button size="lg">
              <ApperIcon name="Home" className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
          
          <Link to="/menu">
            <Button variant="secondary" size="lg">
              <ApperIcon name="Menu" className="w-5 h-5 mr-2" />
              View Menu
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;