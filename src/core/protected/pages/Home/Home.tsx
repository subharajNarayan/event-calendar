import React from 'react'
import MyCalendar from '../EventCalendar/MyCalendar';
import { useDispatch } from 'react-redux';
import { logoutAction } from '../../../../store/root-reducer';
import useAuthentication from '../../../../services/authentication/AuthService';

const Home = () => {

  const {getAuthUser} = useAuthentication();
const user = getAuthUser();

const dispatch = useDispatch()

  const LogOutAction = () => {
    dispatch(logoutAction())
  }

  React.useEffect(() => {
    if (user.role && user.role.toLowerCase() !== 'team_member') {
      LogOutAction();
      window.location.reload();
    }
  },[])

  return (
    <div className="main-content" style={{width: '100%'}}>
        <div className="main-content-home">
          <div className="body-calendar">
            <MyCalendar events={[]} />
          </div>
        </div>
      </div>
  )
}

export default Home