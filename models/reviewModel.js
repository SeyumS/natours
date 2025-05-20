const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema({
  review: {
    type: String,
    required: [true, ' you must write a review']
  },
  rating: {
    type: Number,
    required: [true, 'you must leave a rating']
  },
  createdAt:{
    type: Date,
    default: Date.now
  },
  tour:{
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
  user:{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to a user']
    }
},
{
  toJSON: {virtuals:true},
  toObject: {virtuals:true}
});
reviewSchema.index({tour: 1, user:1}, {unique: true});

reviewSchema.pre(/^find/, function() {
  this.populate({
    path: 'tour',
    select: 'name'
  }).populate({
    path: 'user',
    select: 'name photo'
  })
})

reviewSchema.statics.calcAverageRatings = async function(tourId){
 const stats = await this.aggregate([{
    $match: {tour: tourId}
  },
{
    $group: {
      _id: '$tour',
      nRating: {$sum: 1},
      avgRerating: {$avg: $rating}
    }
}
])
console.log(stats);

if(stats.length < 0){
await Tour.findByIdAndUpdate(tourId, {
  ratingsQuantity: stats[0].nRating,
  ratingsAverage: stats[0].avgRating
});
};
}

reviewSchema.post('save', function(){

  this.contructor.calcAverageRating(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function(next){
  const r = await this.findOne()
  console.log(r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageRatings(this.r.tour)
})
const Reviews = mongoose.model('Reviews', reviewSchema);

module.exports = Reviews;