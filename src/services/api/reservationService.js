import { getApperClient } from "@/services/apperClient";

export const reservationService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('reservation_c', {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "customer_name_c" } },
          { field: { Name: "customer_email_c" } },
          { field: { Name: "customer_phone_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "time_c" } },
          { field: { Name: "party_size_c" } },
          { field: { Name: "special_requests_c" } },
          { field: { Name: "status_c" } }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching reservations:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('reservation_c', id, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "customer_name_c" } },
          { field: { Name: "customer_email_c" } },
          { field: { Name: "customer_phone_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "time_c" } },
          { field: { Name: "party_size_c" } },
          { field: { Name: "special_requests_c" } },
          { field: { Name: "status_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching reservation ${id}:`, error);
      return null;
    }
  },

  async create(reservationData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('reservation_c', {
        records: [
          {
            Name: reservationData.customer_name_c || reservationData.customerName,
            customer_name_c: reservationData.customer_name_c || reservationData.customerName,
            customer_email_c: reservationData.customer_email_c || reservationData.customerEmail,
            customer_phone_c: reservationData.customer_phone_c || reservationData.customerPhone,
            date_c: reservationData.date_c || reservationData.date,
            time_c: reservationData.time_c || reservationData.time,
            party_size_c: parseInt(reservationData.party_size_c || reservationData.partySize),
            special_requests_c: reservationData.special_requests_c || reservationData.specialRequests || "",
            status_c: "confirmed"
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create reservation:`, failed);
          return null;
        }
        
        const created = response.results[0]?.data;
        
        // Send confirmation email via Edge function
        try {
          const emailResult = await apperClient.functions.invoke(
            import.meta.env.VITE_SEND_RESERVATION_EMAIL,
            {
              body: JSON.stringify({
                customerName: reservationData.customer_name_c || reservationData.customerName,
                customerEmail: reservationData.customer_email_c || reservationData.customerEmail,
                customerPhone: reservationData.customer_phone_c || reservationData.customerPhone,
                date: reservationData.date_c || reservationData.date,
                time: reservationData.time_c || reservationData.time,
                partySize: reservationData.party_size_c || reservationData.partySize,
                specialRequests: reservationData.special_requests_c || reservationData.specialRequests || ""
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
        
        return created;
      }

      return null;
    } catch (error) {
      console.error("Error creating reservation:", error);
      return null;
    }
  },

  async update(id, data) {
    try {
      const apperClient = getApperClient();
      const updateData = {
        Id: id,
        ...(data.customer_name_c && { customer_name_c: data.customer_name_c }),
        ...(data.customer_email_c && { customer_email_c: data.customer_email_c }),
        ...(data.customer_phone_c && { customer_phone_c: data.customer_phone_c }),
        ...(data.date_c && { date_c: data.date_c }),
        ...(data.time_c && { time_c: data.time_c }),
        ...(data.party_size_c && { party_size_c: parseInt(data.party_size_c) }),
        ...(data.special_requests_c !== undefined && { special_requests_c: data.special_requests_c }),
        ...(data.status_c && { status_c: data.status_c })
      };

      const response = await apperClient.updateRecord('reservation_c', {
        records: [updateData]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update reservation:`, failed);
          return null;
        }
        return response.results[0]?.data;
      }

      return null;
    } catch (error) {
      console.error("Error updating reservation:", error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('reservation_c', {
        RecordIds: [id]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete reservation:`, failed);
          return null;
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting reservation:", error);
      return null;
    }
  },

  async checkAvailability(date, time) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('reservation_c', {
        fields: [{ field: { Name: "Id" } }],
        where: [
          { FieldName: "date_c", Operator: "EqualTo", Values: [date] },
          { FieldName: "time_c", Operator: "EqualTo", Values: [time] },
          { FieldName: "status_c", Operator: "EqualTo", Values: ["confirmed"] }
        ],
        pagingInfo: { limit: 10, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return true;
      }

      const existingCount = response.data?.length || 0;
      return existingCount < 3;
    } catch (error) {
      console.error("Error checking availability:", error);
      return true;
    }
  },

  async getAvailableTimeSlots(date) {
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