import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { reservationService } from "@/services/api/reservationService";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
const ReservationForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    partySize: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    specialRequests: ""
  });
  
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Check availability when date changes
    if (name === "date" && value) {
      checkAvailability(value);
    }
  };

  const checkAvailability = async (date) => {
    try {
      setCheckingAvailability(true);
      const slots = await reservationService.getAvailableTimeSlots(date);
      setAvailableSlots(slots);
      
      if (slots.length === 0) {
        toast.warning("No available time slots for this date. Please select another date.");
      }
    } catch (error) {
      toast.error("Failed to check availability");
      setAvailableSlots([]);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.partySize) newErrors.partySize = "Party size is required";
    if (!formData.customerName.trim()) newErrors.customerName = "Name is required";
    if (!formData.customerEmail.trim()) newErrors.customerEmail = "Email is required";
    if (!formData.customerPhone.trim()) newErrors.customerPhone = "Phone is required";
    
    // Email validation
    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Please enter a valid email";
    }
    
    // Phone validation
    if (formData.customerPhone && !/^\(\d{3}\)\s\d{3}-\d{4}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = "Phone format: (555) 123-4567";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

try {
      setLoading(true);
      
      // Check final availability
const isAvailable = await reservationService.checkAvailability(formData.date, formData.time);
      
      if (!isAvailable) {
        toast.error("This time slot is no longer available. Please select another time.");
        return;
      }

      const reservationPayload = {
        customer_name_c: formData.customerName,
        customer_email_c: formData.customerEmail,
        customer_phone_c: formData.customerPhone,
        date_c: formData.date,
        time_c: formData.time,
        party_size_c: formData.partySize,
        special_requests_c: formData.specialRequests
      };

      await reservationService.create(reservationPayload);
      setLoading(false);
      
      // Show success toast after loading is complete
      toast.success("Reservation confirmed! We look forward to seeing you.");
      
      // Delay form reset to ensure toast is visible
setTimeout(() => {
        // Reset form
        setFormData({
          date: "",
          time: "",
          partySize: "",
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          specialRequests: ""
        });
        setAvailableSlots([]);
      }, 500);
      
    } catch (error) {
      toast.error("Failed to create reservation. Please try again.");
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Get maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-secondary mb-4">
            Reserve Your Table
          </h2>
          <p className="text-gray-600">
            Book your perfect dining experience with us
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="date"
              type="date"
              label="Preferred Date"
              value={formData.date}
              onChange={handleInputChange}
              min={today}
              max={maxDateString}
              error={errors.date}
              required
            />
            
            <Select
              name="time"
              label="Preferred Time"
              value={formData.time}
              onChange={handleInputChange}
              error={errors.time}
              required
              disabled={!formData.date || checkingAvailability}
            >
              <option value="">
                {checkingAvailability ? "Checking availability..." : "Select time"}
              </option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>
                  {new Date(`2000-01-01T${slot}`).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </option>
              ))}
            </Select>
          </div>

          <Select
            name="partySize"
            label="Party Size"
            value={formData.partySize}
            onChange={handleInputChange}
            error={errors.partySize}
            required
          >
            <option value="">Select party size</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
              <option key={size} value={size}>
                {size} {size === 1 ? "person" : "people"}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="customerName"
              label="Full Name"
              value={formData.customerName}
              onChange={handleInputChange}
              error={errors.customerName}
              required
            />
            
            <Input
              name="customerEmail"
              type="email"
              label="Email Address"
              value={formData.customerEmail}
              onChange={handleInputChange}
              error={errors.customerEmail}
              required
            />
          </div>

          <Input
            name="customerPhone"
            label="Phone Number"
            placeholder="(555) 123-4567"
            value={formData.customerPhone}
            onChange={handleInputChange}
            error={errors.customerPhone}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows={4}
              className="input-field resize-none"
              placeholder="Any special dietary requirements, celebrations, or seating preferences..."
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              size="lg"
              loading={loading}
              disabled={loading || checkingAvailability}
              className="w-full"
            >
              <ApperIcon name="Calendar" className="w-5 h-5 mr-2" />
              Confirm Reservation
            </Button>
          </motion.div>
        </form>
      </div>
    </Card>
  );
};

export default ReservationForm;