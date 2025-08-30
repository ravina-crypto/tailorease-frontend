import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "./firebase";

const API_URL = "https://multiservice-backend.onrender.com";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [targetId, setTargetId] = useState(""); // tailorId or deliveryId

  // ✅ Fetch reviews
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/reviews/${targetId}`);
      setReviews(data);
    } catch (err) {
      console.error(err);
      alert("❌ Error fetching reviews");
    }
  };

  // ✅ Submit review
  const submitReview = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Login required");

      await axios.post(`${API_URL}/reviews`, {
        customerId: user.uid,
        targetId,
        rating,
        comment,
      });

      alert("✅ Review submitted!");
      setComment("");
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit review");
    }
  };

  useEffect(() => {
    if (targetId) fetchReviews();
  }, [targetId]);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>⭐ Reviews & Ratings</h2>

      <input
        type="text"
        placeholder="Enter Tailor/Delivery ID"
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
        style={{ padding: "10px", margin: "10px", width: "250px" }}
      />

      <h3>Leave a Review</h3>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        style={{ padding: "10px", margin: "10px", width: "100px" }}
      />
      <br />
      <textarea
        placeholder="Write your feedback"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ padding: "10px", margin: "10px", width: "300px" }}
      />
      <br />
      <button
        onClick={submitReview}
        style={{
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Submit Review
      </button>

      <h3 style={{ marginTop: "30px" }}>📜 Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {reviews.map((r, i) => (
            <li
              key={i}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px auto",
                width: "300px",
                borderRadius: "5px",
              }}
            >
              <p>⭐ {r.rating}/5</p>
              <p>{r.comment}</p>
              <small>By: {r.customerId}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Reviews;
