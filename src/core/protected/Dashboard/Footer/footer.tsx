import React from 'react'
import { CFooter } from '@coreui/react';
import { Nav, NavItem, NavLink } from 'reactstrap';

const AppFooter = () => {
  return (
    <CFooter>
        <Nav className='w-100 justify-content-center align-items-baseline'>
          {/* <NavItem>
            <NavLink href='#' target='_blank' rel="noopener noreferrer">
              React Template
            </NavLink>
            <span className="ms-1">&copy; 2022.</span>
          </NavItem> */}
          <NavItem className="d-flex align-items-baseline">
            <span className="me-1"> &copy; Copyright-2023</span>
            <NavLink href='#' target='_blank' rel="noopener noreferrer">
              SmartTech Solution Pvt.Ltd.
            </NavLink>
          </NavItem>
            <span className="mx-2">All Right Reserved </span>
        </Nav>
      {/* <div>
        <a href="#" target="_blank" rel="noopener noreferrer">
          React Template
        </a>
        <span className="ms-1">&copy; 2022.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="#" target="_blank" rel="noopener noreferrer">
          SmartTech Solution Pvt.Ltd.
        </a>
      </div> */}
    </CFooter>
  )
}

export default React.memo(AppFooter)
