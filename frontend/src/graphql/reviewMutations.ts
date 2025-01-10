import { gql } from "@apollo/client";

export const CREATE_REVIEW = gql`
  mutation CreateReview($reviewData: ReviewInput!) {
    createReview(reviewData: $reviewData) {
      id
      title
      comment
      rating
      date
    }
  }
`;
