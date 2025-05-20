import axios from 'axios';
import {showAlert} from './alerts';
const stripe = Stripe('pk_test_51RQPZMQJWLre3pYPJKEpjcIudLkqx6VDB3ENRZngRPHUAy6oN1iIvM8glYJEfvlMyFr5z6ysdjOeRoHsbV1HyFhL00lrIv12Dy');

export const bookTour = async tourid =>{
  try{
  // 1) Get checkout session from endpoint API
  const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
  console.log(session);
  // 2) Create checkout form + charge credit card
  await stripe.redirectToCheckout({
    sessionId: session.data.session.id
  })
  }catch(err){
    console.log(err);
    showAlert('error', err);
  }
}