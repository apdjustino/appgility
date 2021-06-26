import React, { ComponentType } from 'react'
import { Route } from 'react-router-dom'
import { withAuthenticationRequired } from '@auth0/auth0-react'

interface OwnProps {
  component: ComponentType<any>,
  path: string
}

const ProtectedRoute = ({ component, ...rest }: OwnProps) => {
  return (
    <Route 
      { ...rest }
      component={withAuthenticationRequired(component)}
    />
  )
}

export default ProtectedRoute