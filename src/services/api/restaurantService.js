import { getApperClient } from "@/services/apperClient";

export const restaurantService = {
  async getInfo() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('restaurant_info_c', {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "hours_monday_c" } },
          { field: { Name: "hours_tuesday_c" } },
          { field: { Name: "hours_wednesday_c" } },
          { field: { Name: "hours_thursday_c" } },
          { field: { Name: "hours_friday_c" } },
          { field: { Name: "hours_saturday_c" } },
          { field: { Name: "hours_sunday_c" } },
          { field: { Name: "coordinates_lat_c" } },
          { field: { Name: "coordinates_lng_c" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const data = response.data?.[0];
      if (!data) return null;

      return {
        Id: data.Id,
        name: data.name_c || data.Name,
        address: data.address_c,
        phone: data.phone_c,
        email: data.email_c,
        hours: {
          monday: data.hours_monday_c,
          tuesday: data.hours_tuesday_c,
          wednesday: data.hours_wednesday_c,
          thursday: data.hours_thursday_c,
          friday: data.hours_friday_c,
          saturday: data.hours_saturday_c,
          sunday: data.hours_sunday_c
        },
        coordinates: {
          lat: data.coordinates_lat_c,
          lng: data.coordinates_lng_c
        }
      };
    } catch (error) {
      console.error("Error fetching restaurant info:", error);
      return null;
    }
  },

  async updateInfo(data) {
    try {
      const apperClient = getApperClient();
      const currentInfo = await this.getInfo();
      if (!currentInfo) return null;

      const updateData = {
        Id: currentInfo.Id,
        ...(data.name_c && { name_c: data.name_c }),
        ...(data.address_c && { address_c: data.address_c }),
        ...(data.phone_c && { phone_c: data.phone_c }),
        ...(data.email_c && { email_c: data.email_c }),
        ...(data.hours_monday_c && { hours_monday_c: data.hours_monday_c }),
        ...(data.hours_tuesday_c && { hours_tuesday_c: data.hours_tuesday_c }),
        ...(data.hours_wednesday_c && { hours_wednesday_c: data.hours_wednesday_c }),
        ...(data.hours_thursday_c && { hours_thursday_c: data.hours_thursday_c }),
        ...(data.hours_friday_c && { hours_friday_c: data.hours_friday_c }),
        ...(data.hours_saturday_c && { hours_saturday_c: data.hours_saturday_c }),
        ...(data.hours_sunday_c && { hours_sunday_c: data.hours_sunday_c }),
        ...(data.coordinates_lat_c && { coordinates_lat_c: data.coordinates_lat_c }),
        ...(data.coordinates_lng_c && { coordinates_lng_c: data.coordinates_lng_c })
      };

      const response = await apperClient.updateRecord('restaurant_info_c', {
        records: [updateData]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return this.getInfo();
    } catch (error) {
      console.error("Error updating restaurant info:", error);
      return null;
    }
  },

  async getHours() {
    const info = await this.getInfo();
    return info?.hours || {};
  },

  async getLocation() {
    const info = await this.getInfo();
    return info ? {
      address: info.address,
      coordinates: info.coordinates
    } : null;
  },

  async getContactInfo() {
    const info = await this.getInfo();
    return info ? {
      phone: info.phone,
      email: info.email,
      address: info.address
    } : null;
  }
};