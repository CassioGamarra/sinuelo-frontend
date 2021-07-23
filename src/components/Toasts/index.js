import './styles.css';
import React from 'react';

import 'react-toastify/dist/ReactToastify.min.css';

import { toast, ToastContainer } from 'react-toastify'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

//Styled Component
const Toast = ToastContainer;
export const showToast = ({ type, message }) => {
  let content = null;
  switch (type) {
    case 'success':
      content = <div><FontAwesomeIcon icon={faTimesCircle} />  {message}</div>;
      toast.success(content);
      break;
    case 'warn':
      content = <div><FontAwesomeIcon icon={faExclamationTriangle} />  {message}</div>;
      toast.warn(content);
      break;
    case 'error':
      content = <div><FontAwesomeIcon icon={faTimesCircle} />  {message}</div>;
      toast.error(content);
      break;
    default:
      content = <div><FontAwesomeIcon icon={faTimesCircle} />  {message}</div>;
      toast.info(content);
  }
};


export default function ToastAnimated() {
  return <Toast autoClose={3000} pauseOnHover={false} />;
}




    