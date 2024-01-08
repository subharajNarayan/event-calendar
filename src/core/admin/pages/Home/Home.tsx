import React from 'react';
import AppSidebar from '../../Dashboard/Sidebar/sidebar';
import Calendar from '../Calendar';
import { ConnectedProps, connect, useDispatch, useSelector } from 'react-redux';
import { getTaskLogsAction } from '../../../../store/modules/Tasks/getTaskLogs';
import { getTeamMemberLogsAction } from '../../../../store/modules/TeamMember/getTeamMemberLogs';
import { RootState, logoutAction } from '../../../../store/root-reducer';
import axios from 'axios';
import moment from 'moment';
import useAuthentication from '../../../../services/authentication/AuthService';

interface Props extends PropsFromRedux {

}

const Home = (props: Props) => {

  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  // const [isOpen, setIsOpen] = React.useState(false)
  const [fetchEvents, setFetchEvents] = React.useState<number>(0);


  const { getAuthUser } = useAuthentication();
  const user = getAuthUser();


  const dispatch = useDispatch();
  const LogOutAction = () => {
    dispatch(logoutAction())
    // window.location.reload();
  }


  React.useEffect(() => {
    if (user && user.role && user.role?.toLowerCase() !== 'admin') {
      LogOutAction();
      window.location.reload();
    }
  }, [user?.role]);


  // const toggleModal = () => {
  //   setIsOpen(!isOpen)
  // }

  // const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getTaskLogsAction());
    dispatch(getTeamMemberLogsAction())
  }, [])

  const [users, setUsers] = React.useState([]);
  const [events, setEvents] = React.useState<any>([]);

  console.log(events, "AAYO EVENT");

  // Not using anywhere but it just to view/Fetch data
  React.useEffect(() => {
    // Fetch data using Axios when the component mounts
    axios.get('https://event.finliftconsulting.com.np/accounts/api/tasks/') // Replace with API endpoint
      .then((response) => {
        // get js Date Object from momentjs
        let initialEvents = response.data.map((event: any) =>
        ({
          ...event,
          start_date: moment(event.start_date).toDate(), 
          end_date: moment(event.end_date).toDate()
          // start_date: moment.utc(event.start_date).format('YYYY-MM-DD HH:mm:ss'),
          // end_date: moment.utc(event.end_date).format('YYYY-MM-DD HH:mm:ss'),
        }));

        setEvents(initialEvents);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    // Fetch data using Axios when the component mounts
    axios.get('https://event.finliftconsulting.com.np/accounts/api/team-members/') // Replace with API endpoint
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [fetchEvents]);

  const handleEventAdd = () => {
    setFetchEvents(fetchEvents + 1);
  };

  const filteredEvents = events.filter((item: { assigned_user_name: string; }) => {
    return selectedUsers.includes(item.assigned_user_name);
  })


  const handleUserToggle = (userName: string[]) => {
    setSelectedUsers(userName);
  };

  return (
    <>
      <div className='admin-body d-flex'>

        <AppSidebar users={users} onFilterChange={handleUserToggle} />

        <div className="main-content">
          <div className="main-content-home">
            <div className="body-calendar">
              <Calendar events={filteredEvents} allEvents={events} fetchSuccess={handleEventAdd} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


const mapStateToProps = () => ({

})

const mapDispatchToProps = {
  getTaskLogsAction,
  getTeamMemberLogsAction
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(Home);
