import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import {useQuery, useMutation} from '@apollo/client'
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const { loading, error, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);
  const userData = data?.me || {};


  // UNNCESSARY HOOK, REMOVED.
  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;
  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       const token = Auth.loggedIn() ? Auth.getToken() : null;
  //       console.log('bypassing for now')

  //       if (!token) {
  //         return false;
  //       }

  //       const response = await getMe(token);

  //       if (!response.ok) {
  //         throw new Error('something went wrong!');
  //       }

  //       const user = await response.json();
  //       setUserData(user);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   getUserData();
  // }, [userDataLength]);


  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({ variables: { bookId: bookId } })
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
};


  return (
    <>
      <div className='text-light bg-dark p-5'>
      <Container fluid className='text-light bg-dark p-5'>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
      {loading && <p>Loading...</p>}
      {error && <p>Error fetching saved books: {error.message}</p>}
      <Row>
        {(userData?.savedBooks || []).map((book) => {
          return (
            <Col md="4" key={book.bookId}>
              <Card border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  </>
  );
};

export default SavedBooks;
