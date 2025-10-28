import restaurantData from "@/services/mockData/restaurantInfo.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const restaurantService = {
  async getInfo() {
    await delay(200);
    return { ...restaurantData };
  },

  async updateInfo(data) {
    await delay(400);
    Object.assign(restaurantData, data);
    return { ...restaurantData };
  },

  async getHours() {
    await delay(150);
    return { ...restaurantData.hours };
  },

  async getLocation() {
    await delay(150);
    return {
      address: restaurantData.address,
      coordinates: { ...restaurantData.coordinates }
    };
  },

  async getContactInfo() {
    await delay(150);
    return {
      phone: restaurantData.phone,
      email: restaurantData.email,
      address: restaurantData.address
    };
  }
};