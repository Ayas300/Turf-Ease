import React from 'react'
import { useLocation } from 'react-router-dom'
import Footer from './Footer'

const FooterWrapper = () => {
  const location = useLocation()
  
  // Routes where footer should not be displayed
  const excludedRoutes = [
    '/login',
    '/signup',
    '/signup/booker',
    '/signup/owner'
  ]
  
  // Check if current route should exclude footer
  const shouldHideFooter = excludedRoutes.includes(location.pathname)
  
  // Don't render footer on excluded routes
  if (shouldHideFooter) {
    return null
  }
  
  return <Footer />
}

export default FooterWrapper