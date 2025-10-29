import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import StarRating from "@/components/molecules/StarRating";
import ApperIcon from "@/components/ApperIcon";

const ReviewCard = ({ review }) => {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold mr-4"
            whileHover={{ scale: 1.1 }}
          >
{review.reviewerName?.charAt(0) || "?"}
          </motion.div>
          <div>
<h4 className="font-semibold text-gray-900">{review.reviewerName || "Anonymous"}</h4>
            <p className="text-sm text-gray-500">
{format(new Date(review.date || new Date()), "MMMM d, yyyy")}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
<StarRating rating={review.rating || 0} />
          {review.verified && (
            <motion.div
              className="flex items-center text-success text-xs"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1" />
              Verified
            </motion.div>
          )}
        </div>
      </div>
      
<p className="text-gray-700 leading-relaxed">{review.reviewText || "No review text provided"}</p>
    </Card>
  );
};

export default ReviewCard;