import { gql } from '@apollo/client';


export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        }
      }
    }
`;


export const ADD_USER = gql`
mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        username
        email
      }
    }
  }
  `;

export const ADD_BOOK = gql`
mutation SaveBook($bookData: BookInput!) {
  saveBook(bookData: $bookData) {
    _id
    username
    email
    bookCount
    savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
  }
}`;

export const REMOVE_BOOK = gql`
  mutation RemoveBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      savedBooks {
        bookId
        title
      }
    }
  }
`;
