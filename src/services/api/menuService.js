import menuItemsData from "@/services/mockData/menuItems.json";

let menuItems = [...menuItemsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const menuService = {
  async getAll() {
    await delay(300);
    return [...menuItems];
  },

  async getByCategory(category) {
    await delay(200);
    return menuItems.filter(item => item.category === category);
  },

  async getById(id) {
    await delay(200);
    return menuItems.find(item => item.Id === id) || null;
  },

  async searchItems(query) {
    await delay(250);
    const lowercaseQuery = query.toLowerCase();
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery)
    );
  },

  async getByDietaryTags(tags) {
    await delay(200);
    if (!tags || tags.length === 0) return [...menuItems];
    return menuItems.filter(item => 
      tags.some(tag => item.dietaryTags.includes(tag))
    );
  },

  getCategories() {
    return ["appetizers", "mains", "desserts", "drinks"];
  },

  getDietaryTags() {
    return ["vegetarian", "vegan", "gluten-free"];
  }
};