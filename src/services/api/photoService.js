import mockPhotos from '@/services/mockData/photos.json';

const photoService = {
  getAllPhotos: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockPhotos]);
      }, 300);
    });
  },

  getPhotosByCategory: async (category) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockPhotos.filter(photo => photo.category === category);
        resolve([...filtered]);
      }, 300);
    });
  }
};

export default photoService;