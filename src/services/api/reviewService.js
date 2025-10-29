import { getApperClient } from "@/services/apperClient";

export const reviewService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('review_c', {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_text_c" } },
          { field: { Name: "reviewer_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "verified_c" } }
        ],
        orderBy: [{ fieldName: "date_c", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('review_c', id, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_text_c" } },
          { field: { Name: "reviewer_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "verified_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error);
      return null;
    }
  },

  async create(reviewData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('review_c', {
        records: [
          {
            Name: reviewData.reviewer_name_c || reviewData.reviewerName,
            rating_c: parseInt(reviewData.rating_c || reviewData.rating),
            review_text_c: reviewData.review_text_c || reviewData.reviewText,
            reviewer_name_c: reviewData.reviewer_name_c || reviewData.reviewerName,
            date_c: new Date().toISOString().split('T')[0],
            verified_c: false
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
          console.error(`Failed to create review:`, failed);
          return null;
        }
        return response.results[0]?.data;
      }

      return null;
    } catch (error) {
      console.error("Error creating review:", error);
      return null;
    }
  },

  async getSortedByRating(ascending = false) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('review_c', {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_text_c" } },
          { field: { Name: "reviewer_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "verified_c" } }
        ],
        orderBy: [{ fieldName: "rating_c", sorttype: ascending ? "ASC" : "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching sorted reviews:", error);
      return [];
    }
  },

  async getAverageRating() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('review_c', {
        fields: [
          { field: { Name: "rating_c" } }
        ],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return 0;
      }

      const reviews = response.data || [];
      if (reviews.length === 0) return 0;
      
      const sum = reviews.reduce((acc, review) => acc + (review.rating_c || 0), 0);
      return Math.round((sum / reviews.length) * 10) / 10;
    } catch (error) {
      console.error("Error calculating average rating:", error);
      return 0;
    }
  },

  async getRatingDistribution() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('review_c', {
        fields: [
          { field: { Name: "rating_c" } }
        ],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }

      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      const reviews = response.data || [];
      
      reviews.forEach(review => {
        const rating = review.rating_c;
        if (rating >= 1 && rating <= 5) {
          distribution[rating]++;
        }
      });
      
      return distribution;
    } catch (error) {
      console.error("Error calculating rating distribution:", error);
      return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }
  }
};