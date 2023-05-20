import { gql } from '@apollo/client';

export const QUERRY_SINGLE_USER = gql`
  query GetSingleUser {
    getSingleUser {
      _id
      username
      email
      savedBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;
