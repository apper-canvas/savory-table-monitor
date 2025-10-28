import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop')"
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-5xl md:text-7xl font-display font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Savory Table
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Experience culinary excellence with premium ingredients, 
          expertly crafted dishes, and exceptional service
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link to="/reservations">
            <Button size="lg" className="bg-primary hover:bg-accent text-white px-8 py-4 text-lg">
              <ApperIcon name="Calendar" className="w-5 h-5 mr-2" />
              Book a Table
            </Button>
          </Link>
          
          <Link to="/menu">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-secondary px-8 py-4 text-lg"
            >
              <ApperIcon name="Menu" className="w-5 h-5 mr-2" />
              View Menu
            </Button>
          </Link>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ApperIcon name="ChevronDown" className="w-6 h-6 text-white" />
      </motion.div>
    </section>
  );
};

export default HeroSection;