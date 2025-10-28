import reservationsData from "@/services/mockData/reservations.json";

let reservations = [...reservationsData];

// Initialize ApperClient for Edge function integration
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reservationService = {
  async getAll() {
    await delay(300);
    return [...reservations];
  },

  async getById(id) {
    await delay(200);
    return reservations.find(reservation => reservation.Id === id) || null;
  },

  async create(reservationData) {
    await delay(500);
    const newId = Math.max(...reservations.map(r => r.Id)) + 1;
    const newReservation = {
      Id: newId,
      ...reservationData,
      status: "confirmed"
};
    reservations.push(newReservation);
    
    // Send confirmation email via Edge function
    try {
      const emailResult = await apperClient.functions.invoke(
import.meta.env.VITE_SEND_RESERVATION_EMAIL,
        {
          body: JSON.stringify({
            customerName: reservationData.customerName,
            customerEmail: reservationData.customerEmail,
            customerPhone: reservationData.customerPhone,
            date: reservationData.date,
            time: reservationData.time,
            partySize: reservationData.partySize,
            specialRequests: reservationData.specialRequests
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      if (!emailResult.success) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SEND_RESERVATION_EMAIL}. The response body is: ${JSON.stringify(emailResult)}.`);
      }
    } catch (error) {
      console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_SEND_RESERVATION_EMAIL}. The error is: ${error.message}`);
    }
    
    return newReservation;
  },

  async update(id, data) {
    await delay(400);
    const index = reservations.findIndex(reservation => reservation.Id === id);
    if (index !== -1) {
      reservations[index] = { ...reservations[index], ...data };
      return reservations[index];
    }
    return null;
  },

  async delete(id) {
    await delay(300);
    const index = reservations.findIndex(reservation => reservation.Id === id);
    if (index !== -1) {
      const deleted = reservations[index];
      reservations.splice(index, 1);
      return deleted;
    }
    return null;
  },

  async checkAvailability(date, time) {
    await delay(300);
    const existingReservations = reservations.filter(r => 
      r.date === date && r.time === time && r.status === "confirmed"
    );
    // Simulate table capacity - allow up to 3 reservations per time slot
    return existingReservations.length < 3;
  },

  async getAvailableTimeSlots(date) {
    await delay(400);
    const timeSlots = [
      "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
      "20:00", "20:30", "21:00", "21:30", "22:00"
    ];
    
    const availableSlots = [];
    for (const time of timeSlots) {
      const isAvailable = await this.checkAvailability(date, time);
      if (isAvailable) {
        availableSlots.push(time);
      }
    }
    return availableSlots;
  }
};