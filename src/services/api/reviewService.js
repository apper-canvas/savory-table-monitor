import reviewsData from "@/services/mockData/reviews.json";

let reviews = [...reviewsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reviewService = {
  async getAll() {
    await delay(400);
    return [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getById(id) {
    await delay(200);
    return reviews.find(review => review.Id === id) || null;
  },

  async create(reviewData) {
    await delay(500);
    const newId = Math.max(...reviews.map(r => r.Id)) + 1;
    const newReview = {
      Id: newId,
      ...reviewData,
      date: new Date().toISOString().split('T')[0],
      verified: false
    };
    reviews.push(newReview);
    return newReview;
  },

  async getSortedByRating(ascending = false) {
    await delay(300);
    return [...reviews].sort((a, b) => 
      ascending ? a.rating - b.rating : b.rating - a.rating
    );
  },

  async getAverageRating() {
    await delay(200);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  },

  async getRatingDistribution() {
    await delay(200);
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  }
};