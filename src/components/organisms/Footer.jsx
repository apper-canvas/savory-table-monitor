import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  const quickLinks = [
    { name: "Menu", path: "/menu" },
    { name: "Reservations", path: "/reservations" },
    { name: "Reviews", path: "/reviews" },
    { name: "Contact", path: "/contact" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", href: "#" },
    { name: "Instagram", icon: "Instagram", href: "#" },
    { name: "Twitter", icon: "Twitter", href: "#" }
  ];

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <motion.div
              className="flex items-center mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <ApperIcon name="ChefHat" className="w-8 h-8 text-primary mr-2" />
              <span className="text-2xl font-display font-bold">
                Savory Table
              </span>
            </motion.div>
            <p className="text-gray-300 mb-6 max-w-md">
              Experience exceptional dining with carefully crafted dishes, 
              premium ingredients, and impeccable service in an elegant atmosphere.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ApperIcon name={social.icon} className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <ApperIcon name="MapPin" className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm">123 Culinary Avenue<br />Downtown District, NY 10001</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Phone" className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm">(555) SAVORY-1</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Mail" className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm">reservations@savorytable.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Savory Table. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;