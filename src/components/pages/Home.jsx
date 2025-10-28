import { motion } from "framer-motion";
import HeroSection from "@/components/organisms/HeroSection";
import PhotoCarousel from "@/components/organisms/PhotoCarousel";
import MenuSection from "@/components/organisms/MenuSection";
import ReviewsSection from "@/components/organisms/ReviewsSection";
import ApperIcon from "@/components/ApperIcon";

const Home = () => {
  const features = [
    {
      icon: "ChefHat",
      title: "Expert Chefs",
      description: "Our culinary team brings years of experience and passion to every dish"
    },
    {
      icon: "Heart",
      title: "Fresh Ingredients",
      description: "We source only the finest, freshest ingredients from local suppliers"
    },
    {
      icon: "Award",
      title: "Award Winning",
      description: "Recognized for excellence in dining and customer service"
    }
  ];

return (
    <div className="pt-20">
      <HeroSection />
      
      {/* Photo Carousel Section */}
      <section className="py-16 bg-gradient-to-b from-white via-surface to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-4">
              Experience Our Restaurant
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the ambiance, atmosphere, and artistry that makes The Savory Table unforgettable
            </p>
          </motion.div>
          
          <PhotoCarousel />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-6">
              Why Choose Savory Table?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of culinary artistry, premium ingredients, 
              and exceptional hospitality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <ApperIcon name={feature.icon} className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MenuSection />
      <ReviewsSection />
      
      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-secondary to-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Ready for an Unforgettable Experience?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join us for an evening of exceptional cuisine and warm hospitality. 
              Reserve your table today and discover why we're the talk of the town.
            </p>
            <motion.a
              href="/reservations"
              className="inline-flex items-center bg-white text-primary px-8 py-4 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Calendar" className="w-5 h-5 mr-2" />
              Book Your Table Now
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;