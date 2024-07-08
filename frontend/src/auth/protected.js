import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';

export const Protected = ({children}) => {
    if(!isAuthenticated()){
        return <Navigate to="/signin"/>
    }
  return (
    children
  )
}