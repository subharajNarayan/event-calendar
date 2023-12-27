import React from 'react';
import AppSidebar from '../../Dashboard/Sidebar/sidebar';
import Calendar from '../Calendar';
import { ConnectedProps, connect, useDispatch, useSelector } from 'react-redux';
import { getTaskLogsAction } from '../../../../store/modules/Tasks/getTaskLogs';
import { getTeamMemberLogsAction } from '../../../../store/modules/TeamMember/getTeamMemberLogs';
import { RootState } from '../../../../store/root-reducer';
import axios from 'axios';
import moment from 'moment';


interface Props extends PropsFromRedux {

}

const Home = (props: Props) => {

  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleModal = () => {
    setIsOpen(!isOpen)
  }

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getTaskLogsAction());
    dispatch(getTeamMemberLogsAction())
  }, [])

  const [users, setUsers] = React.useState([]);
  const [events, setEvents] = React.useState<any>([]);

  // Not using anywhere but it just to view/Fetch data
  React.useEffect(() => {
    // Fetch data using Axios when the component mounts
    axios.get('https://kyush.pythonanywhere.com/accounts/api/tasks/') // Replace with API endpoint
      .then((response) => {
        // get js Date Object from momentjs
        let initialEvents = response.data.map((event: any) => 
          ({ 
            ...event, 
            start_date: moment(event.start_date).toDate(), 
            end_date: moment(event.end_date).toDate() 
          }));
          
        setEvents(initialEvents);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    // Fetch data using Axios when the component mounts
    axios.get('https://kyush.pythonanywhere.com/accounts/api/team-members/') // Replace with API endpoint
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const filteredEvents = events.filter((item: { assigned_user_name: string; }) => {
    return selectedUsers.length == 0 || selectedUsers.includes(item.assigned_user_name);
  })


  const handleUserToggle = (userName: string[]) => {
    setSelectedUsers(userName);
  };

  return (
    <>
      <div className='d-flex'>

        <AppSidebar users={users} onFilterChange={handleUserToggle} />

        <div className="main-content">
          <div className="main-content-home">
            <div className="body-calendar">
              <Calendar events={filteredEvents} allEvents={events} />
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
