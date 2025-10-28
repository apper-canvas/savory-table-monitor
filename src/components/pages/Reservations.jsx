import { motion } from "framer-motion";
import ReservationForm from "@/components/organisms/ReservationForm";
import ApperIcon from "@/components/ApperIcon";

const Reservations = () => {
  const restaurantHours = [
    { day: "Monday - Thursday", hours: "5:00 PM - 10:00 PM" },
    { day: "Friday", hours: "5:00 PM - 11:00 PM" },
    { day: "Saturday", hours: "4:00 PM - 11:00 PM" },
    { day: "Sunday", hours: "4:00 PM - 9:00 PM" }
  ];

  const policies = [
    "Reservations are held for 15 minutes past the reserved time",
    "Large parties (8+) may require a deposit",
    "Cancellations accepted up to 2 hours before reservation time",
    "We accommodate dietary restrictions with advance notice"
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-secondary mb-6">
            Make a Reservation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Secure your table for an exceptional dining experience. 
            We can't wait to welcome you to Savory Table.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Reservation Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ReservationForm />
            </motion.div>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-8">
            {/* Restaurant Hours */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <ApperIcon name="Clock" className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Restaurant Hours</h3>
              </div>
              <div className="space-y-2">
                {restaurantHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{schedule.day}</span>
                    <span className="font-medium text-gray-900">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center mb-4">
                <ApperIcon name="Phone" className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Need Help?</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <ApperIcon name="Phone" className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">(555) SAVORY-1</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Mail" className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">reservations@savorytable.com</span>
                </div>
                <p className="text-gray-600 mt-4">
                  Call us for special events, large parties, or if you need assistance with your reservation.
                </p>
              </div>
            </motion.div>

            {/* Reservation Policies */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <ApperIcon name="Info" className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Reservation Policy</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                {policies.map((policy, index) => (
                  <li key={index} className="flex items-start">
                    <ApperIcon name="Check" className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                    {policy}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Special Events */}
            <motion.div
              className="bg-gradient-to-r from-primary to-accent rounded-lg p-6 text-white"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center mb-3">
                <ApperIcon name="Calendar" className="w-6 h-6 mr-3" />
                <h3 className="text-xl font-semibold">Special Events</h3>
              </div>
              <p className="text-sm opacity-90 mb-4">
                Planning a special celebration? Let us create an unforgettable experience for you and your guests.
              </p>
              <a
                href="mailto:events@savorytable.com"
                className="inline-flex items-center text-sm font-medium hover:underline"
              >
                <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                Contact Events Team
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;