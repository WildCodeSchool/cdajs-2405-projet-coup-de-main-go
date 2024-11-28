import { gql } from "@apollo/client";

export const UPDATE_AD_STATUS = gql`
  mutation UpdateAdStatus($id: String!, $status: String!) {
    updateAdStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;
