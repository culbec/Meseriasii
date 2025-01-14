import {
    CollectionReference,
    collection,
    query,
    getDocs,
    doc,
    getDoc, addDoc, where, DocumentReference,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { getLogger } from "../utils/utils";
import {User} from "./userRepository";

export interface Review {
    id?: string;
    meserias: User;
    stars: number;
    text: string;
    user: User;
}

export class ReviewRepository {
    private reviewCollection: CollectionReference = collection(db, "review");

    private log = getLogger("ReviewRepository");

    /**
     * Fetch all reviews from the 'review' collection.
     * @returns A list of reviews or undefined if no reviews found.
     */


public async getReviews(): Promise<Review[] | undefined> {
    const q = query(this.reviewCollection);
    const qSnapshot = await getDocs(q).catch((error) => {
        console.error("Error getting documents: ", error);
        throw new Error("Couldn't get reviews!");
    });

    if (qSnapshot.docs.length === 0) {
    this.log("No reviews found");
    return undefined;
}

const reviews: Review[] = [];

for (const doc of qSnapshot.docs) {
    const reviewData = doc.data() as Review;

    // Resolve Firestore references for 'user' and 'meserias'
    const userRef = reviewData.user as unknown as DocumentReference;
    const meseriasRef = reviewData.meserias as unknown as DocumentReference;

    const userDoc = await getDoc(userRef);
    const meseriasDoc = await getDoc(meseriasRef);

    // Replace references with actual user and meserias data
    if (userDoc.exists() && meseriasDoc.exists()) {
        reviewData.user = { id: userDoc.id, ...userDoc.data() } as User;
        reviewData.meserias = { id: meseriasDoc.id, ...meseriasDoc.data() } as User;
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
    public async getReviewsByStarCount(starCount: number): Promise<Review[] | undefined> {
        if (starCount < 1 || starCount > 5) {
            throw new Error("Star count must be between 1 and 5.");
        }

        const q = query(this.reviewCollection, where("stars", "==", starCount));
        const qSnapshot = await getDocs(q).catch((error) => {
            console.error("Error getting documents by star count: ", error);
            throw new Error("Couldn't get reviews by star count!");
        });

        if (qSnapshot.docs.length === 0) {
            this.log(`No reviews found with ${starCount} stars`);
            return undefined;
        }

        const reviews: Review[] = [];
        for (const doc of qSnapshot.docs) {
            const review = doc.data() as Review;
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
    public async addReview(review: Review): Promise<string> {
        if (!review.meserias || !review.user || !review.stars || !review.text) {
            throw new Error("All fields (meserias, user, stars, text) are required.");
        }

        const newDocRef = await addDoc(this.reviewCollection, review).catch((error) => {
            console.error("Error adding review: ", error);
            throw new Error("Couldn't add the review!");
        });

        this.log("Added new review with ID:", newDocRef.id);

        return newDocRef.id;
    }
}