import React, { useState } from 'react';
import hamburger from '../../../../assets/images/hamburger.png';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, logoutAction } from '../../../../store/root-reducer';
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { toast } from 'react-toastify';
import TokenService from '../../../../services/jwt-token/jwt-token';
import useAuthentication from '../../../../services/authentication/AuthService';

interface Props {
  sidebarToggle: boolean;
  setsidebarToggle: (state: boolean) => void;
}

const AppHeader = (props: Props) => {
  const { sidebarToggle, setsidebarToggle } = props;

  const dispatch = useDispatch();
  const { isAuthenticated } = useAuthentication();

  const LogOutAction = () => {
    dispatch(logoutAction())
    toast.success('LogOut Successful !!!')
    // window.location.reload();
  }

  // const userDetail = useSelector((state: RootState) => state?.userDetails)
  // console.log({ ccc: userDetail });


  const userDetails = TokenService.getAccessToken();


  const togglesidebar = () => setsidebarToggle(!sidebarToggle);
  // console.log(sidebarToggle, "True");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);


  return (
    <>
      <header className='header'>
        <div className='d-flex justify-content-between align-items-center w-100'>
          {/* <div className="d-flex align-items-center">
            <span className="toggler" onClick={togglesidebar}>
              <img src={hamburger} alt="hamburger" width="17" />
            </span>
          </div> */}
          <div className="pt-3" style={{ paddingBottom: "0.8rem" }}>
            <div className='header-top align-vertical px-3 mt-2'>
              <div>
                <h6 className='text text-start text-uppercase font-bold'>DYNASEl USA - TASK MANAGER</h6>
              </div>
            </div>
          </div>
          <div className='list list__inline list-separator px-4'>
            <div className='header-username'>
              {isAuthenticated() && (

                <Dropdown isOpen={dropdownOpen} toggle={toggle} tag="div">
                  <DropdownToggle className="auth" tag="div" role="button">
                    <div className="textbox mr-2">
                      <h6 className="username font-bold">{userDetails.firstname}</h6>
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
