import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { reviewService } from "@/services/api/reviewService";
import { toast } from "react-toastify";
import ReviewCard from "@/components/molecules/ReviewCard";
import StarRating from "@/components/molecules/StarRating";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    loadReviewsData();
  }, []);

  useEffect(() => {
    sortReviews();
  }, [sortBy]);

  const loadReviewsData = async () => {
    try {
      setLoading(true);
      setError("");
      const [allReviews, avgRating, distribution] = await Promise.all([
        reviewService.getAll(),
        reviewService.getAverageRating(),
        reviewService.getRatingDistribution()
      ]);
      
      setReviews(allReviews);
      setAverageRating(avgRating);
      setRatingDistribution(distribution);
    } catch (err) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const sortReviews = async () => {
    try {
      let sortedReviews;
      switch (sortBy) {
        case "highest":
          sortedReviews = await reviewService.getSortedByRating(false);
          break;
        case "lowest":
          sortedReviews = await reviewService.getSortedByRating(true);
          break;
        case "newest":
        default:
          sortedReviews = await reviewService.getAll();
          break;
      }
      setReviews(sortedReviews);
    } catch (err) {
      console.error("Failed to sort reviews:", err);
    }
  };

  const getRatingPercentage = (rating) => {
    const total = Object.values(ratingDistribution).reduce((sum, count) => sum + count, 0);
    return total > 0 ? Math.round((ratingDistribution[rating] / total) * 100) : 0;
  };

  if (loading) return <Loading type="reviews" />;
  if (error) return <Error message={error} onRetry={loadReviewsData} />;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-secondary mb-6">
            Customer Reviews
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear what our guests have to say about their dining experience at Savory Table
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Rating Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 sticky top-28"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary mb-2">{averageRating}</div>
                <StarRating rating={Math.floor(averageRating)} size="w-6 h-6" />
                <p className="text-gray-600 mt-2">
                  Based on {reviews.length} reviews
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-4">{rating}</span>
                    <ApperIcon name="Star" className="w-4 h-4 text-accent" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getRatingPercentage(rating)}%` }}
                      />
                    </div>
                    <span className="w-10 text-gray-600">
                      {getRatingPercentage(rating)}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Sort Options */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Reviews
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </motion.div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3">
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900">
                All Reviews ({reviews.length})
              </h2>
            </motion.div>

            {reviews.length > 0 ? (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <ReviewCard review={review} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Empty
                title="No reviews yet"
                description="Be the first to share your experience at Savory Table!"
                icon="MessageCircle"
                action={
                  <Button onClick={() => window.location.href = "/reservations"}>
                    Make a Reservation
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;