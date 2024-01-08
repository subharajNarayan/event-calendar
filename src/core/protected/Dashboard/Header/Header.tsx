import React, { useState } from 'react';
import hamburger from '../../../../assets/images/hamburger.png';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, logoutAction } from '../../../../store/root-reducer';
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { toast } from 'react-toastify';
import TokenService from '../../../../services/jwt-token/jwt-token';
import useAuthentication from '../../../../services/authentication/AuthService';
import Dynasel_logo from '../../../../assets/images/Dynasel_logo.jpg';

interface Props {
  sidebarToggle: boolean;
  setsidebarToggle: (state: boolean) => void;
}

const AppHeader = (props: Props) => {
  // const { sidebarToggle, setsidebarToggle } = props;

  const dispatch = useDispatch();
  const { isAuthenticated } = useAuthentication();

  const LogOutAction = () => {
    dispatch(logoutAction())
    toast.success('LogOut Successful !!!')
    // window.location.reload();
  }


  const userDetails = TokenService.getAccessToken();
  console.log({userDetails})


  // const togglesidebar = () => setsidebarToggle(!sidebarToggle);
  // console.log(sidebarToggle, "True");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);


  return (
    <>
      <header className='header'>
        <div className='d-flex justify-content-between align-items-center w-100'>
          <div className="pt-0" style={{ paddingBottom: "0.3rem" }}>
            <div className='header-top align-vertical px-3 mt-2'>
              <div>
                {/* <h6 className='text text-start text-uppercase font-bold'>DYNASEl USA - TASK MANAGER</h6> */}
                <img src={Dynasel_logo} alt="DYNASEL USA - TASK MANAGER" width={172}/>
              </div>
            </div>
          </div>
          <div className='list list__inline list-separator px-4'>
            <div className='header-username'>
              {isAuthenticated() && (

                <Dropdown isOpen={dropdownOpen} toggle={toggle} tag="div">
                  <DropdownToggle className="auth" tag="div" role="button">
                    <div className="textbox mr-2">
                      <h6 className="username font-bold">{userDetails.username}</h6>
                    </div>
                    <i className="ic-dropdown"></i>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={LogOutAction} className="dropdown-item text-danger">
                      <i className="ic-logout"></i>
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </header>

    </>
  )
}

export default AppHeader
