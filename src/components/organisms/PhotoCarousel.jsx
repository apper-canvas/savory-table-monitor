import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import photoService from '@/services/api/photoService';

function PhotoCarousel() {
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const data = await photoService.getAllPhotos();
      setPhotos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load photos. Please try again later.');
      console.error('Error loading photos:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  }, [photos.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const goToSlide = useCallback((index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  useEffect(() => {
    if (!isAutoPlaying || photos.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, photos.length, nextSlide]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  if (loading) {
    return (
      <div className="py-16">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <Error message={error} onRetry={loadPhotos} />
      </div>
    );
  }

  if (photos.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto px-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main carousel container */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-2xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                nextSlide();
              } else if (swipe > swipeConfidenceThreshold) {
                prevSlide();
              }
            }}
            className="absolute w-full h-full"
          >
            {/* Image */}
            <img
              src={photos[currentIndex].imageUrl}
              alt={photos[currentIndex].title}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Photo info */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="max-w-2xl">
                <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold uppercase tracking-wider bg-primary rounded-full">
                  {photos[currentIndex].category}
                </span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-2">
                  {photos[currentIndex].title}
                </h3>
                <p className="text-sm md:text-base text-gray-200">
                  {photos[currentIndex].description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 z-10",
            "w-12 h-12 flex items-center justify-center",
            "bg-white/90 hover:bg-white rounded-full shadow-lg",
            "transition-all duration-200 hover:scale-110 active:scale-95",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          )}
          aria-label="Previous photo"
        >
          <ApperIcon name="ChevronLeft" size={24} className="text-primary" />
        </button>

        <button
          onClick={nextSlide}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 z-10",
            "w-12 h-12 flex items-center justify-center",
            "bg-white/90 hover:bg-white rounded-full shadow-lg",
            "transition-all duration-200 hover:scale-110 active:scale-95",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          )}
          aria-label="Next photo"
        >
          <ApperIcon name="ChevronRight" size={24} className="text-primary" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              currentIndex === index
                ? "bg-primary w-8"
                : "bg-gray-300 hover:bg-gray-400"
            )}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-600">
        <ApperIcon 
          name={isAutoPlaying ? "Play" : "Pause"} 
          size={16} 
        />
        <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
      </div>
    </div>
  );
}

export default PhotoCarousel;