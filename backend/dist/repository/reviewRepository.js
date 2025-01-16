"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const firestore_1 = require("firebase/firestore");
const firebaseConfig_1 = require("../utils/firebaseConfig");
const utils_1 = require("../utils/utils");
class ReviewRepository {
    constructor() {
        this.reviewCollection = (0, firestore_1.collection)(firebaseConfig_1.db, "review");
        this.log = (0, utils_1.getLogger)("ReviewRepository");
    }
    /**
     * Fetch all reviews from the 'review' collection.
     * @returns A list of reviews or undefined if no reviews found.
     */
    async getReviews() {
        const q = (0, firestore_1.query)(this.reviewCollection);
        const qSnapshot = await (0, firestore_1.getDocs)(q).catch((error) => {
            console.error("Error getting documents: ", error);
            throw new Error("Couldn't get reviews!");
        });
        if (qSnapshot.docs.length === 0) {
            this.log("No reviews found");
            return undefined;
        }
        const reviews = [];
        for (const doc of qSnapshot.docs) {
            const reviewData = doc.data();
            // Resolve Firestore references for 'user' and 'meserias'
            const userRef = reviewData.user;
            const meseriasRef = reviewData.meserias;
            const userDoc = await (0, firestore_1.getDoc)(userRef);
            const meseriasDoc = await (0, firestore_1.getDoc)(meseriasRef);
            // Replace references with actual user and meserias data
            if (userDoc.exists() && meseriasDoc.exists()) {
                reviewData.user = Object.assign({ id: userDoc.id }, userDoc.data());
                reviewData.meserias = Object.assign({ id: meseriasDoc.id }, meseriasDoc.data());
            }
            reviewData.id = doc.id; // Add the document ID
            reviews.push(reviewData);
        }
        this.log("Resolved reviews", reviews);
        return reviews;
    }
    /**
         * Fetch reviews by a specific star count.
         * @param starCount The star count to filter by (1-5).
         * @returns A list of reviews matching the star count.
         */
    async getReviewsByStarCount(starCount) {
        if (starCount < 1 || starCount > 5) {
            throw new Error("Star count must be between 1 and 5.");
        }
        const q = (0, firestore_1.query)(this.reviewCollection, (0, firestore_1.where)("stars", "==", starCount));
        const qSnapshot = await (0, firestore_1.getDocs)(q).catch((error) => {
            console.error("Error getting documents by star count: ", error);
            throw new Error("Couldn't get reviews by star count!");
        });
        if (qSnapshot.docs.length === 0) {
            this.log(`No reviews found with ${starCount} stars`);
            return undefined;
        }
        const reviews = [];
        for (const doc of qSnapshot.docs) {
            const review = doc.data();
            review.id = doc.id;
            reviews.push(review);
        }
        this.log(`reviews with ${starCount} stars`, reviews);
        return reviews;
    }
    /**
     * Add a new review to the database.
     * @param review The review object to add.
     * @returns The ID of the newly added review.
     */
    async addReview(review) {
        if (!review.meserias || !review.user || !review.stars || !review.text) {
            throw new Error("All fields (meserias, user, stars, text) are required.");
        }
        const newDocRef = await (0, firestore_1.addDoc)(this.reviewCollection, review).catch((error) => {
            console.error("Error adding review: ", error);
            throw new Error("Couldn't add the review!");
        });
        this.log("Added new review with ID:", newDocRef.id);
        return newDocRef.id;
    }
}
exports.ReviewRepository = ReviewRepository;
