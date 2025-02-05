import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
  mutation AddTransaction($transactionData: TransactionInput!) {
    addTransaction(transactionData: $transactionData) {
      id
      ad {
        id
      }
      userRequester {
        id
      }
      userHelper {
        id
      }
    }
  }
`;
