import React from 'react';
import AppSidebar from '../../Dashboard/Sidebar/sidebar';
import Calendar from '../Calendar';
import { ConnectedProps, connect, useDispatch, useSelector } from 'react-redux';
import { getTaskLogsAction } from '../../../../store/modules/Tasks/getTaskLogs';
import { getTeamMemberLogsAction } from '../../../../store/modules/TeamMember/getTeamMemberLogs';
import { RootState } from '../../../../store/root-reducer';
import axios from 'axios';


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

  // const users = [
  //   { name: 'Subharaj', color: 'blue' },
  //   { name: 'test', color: 'orange' },
  //   { name: 'Kyush', color: 'yellow' },
  //   { name: 'Shreyas', color: 'green' },
  //   { name: 'ABC', color: 'brown' },
  //   { name: 'XYZ', color: 'gray' },
  //   { name: 'EFG', color: 'pink' },
  //   { name: 'STR', color: 'purple' },
  // ];

  // const events = [
  //   {
  //     id: 1,
  //     title: 'Meeting',
  //     start_date: "2023-12-12T02:00",
  //     end_date: "2023-12-14T05:11" ,
  //     description: 'Test',
  //     assigned_user_name: "test",
  //     assigned_colour: "blue"
  //   },
  //   {
  //     id: 2,
  //     title: 'Conference',
  //     start_date: "2023-12-18T14:00",
  //     end_date: "2023-12-20T17:00",
  //     description: 'Test',
  //     assigned_user_name: "Subharaj",
  //     assigned_colour: "orange"

  //   },
  //   {
  //     id: 3,
  //     title: 'Acting',
  //     start_date: "2023-11-13T10:00",
  //     end_date: "2023-11-14T12:00",
  //     description: 'Test',

  //     assigned_user_name: "Kyush",
  //     assigned_colour: "yellow"
  //   },
  //   {
  //     id: 4,
  //     title: 'test',
  //     start_date: "2023-11-20T14:00",
  //     end_date: "2023-11-23T17:00",
  //     description: 'Test',
  //     assigned_user_name: "Shreyas",
  //     assigned_colour: "green"
  //   },
  //   {
  //     id: 5,
  //     title: 'ABC',
  //     start_date: "2023-11-11T10:00",
  //     end_date: "2023-11-12T12:00",
  //     description: 'Test',
  //     assigned_user_name: "ABC",
  //     assigned_colour: "brown"
  //   },
  //   {
  //     id: 6,
  //     title: 'XYZ',
  //     start_date: "2023-12-18T14:00",
  //     end_date: "2023-12-20T17:00",
  //     description: 'Test',
  //     assigned_user_name: "XYZ",
  //     assigned_colour: "gray"
  //   },
  //   {
  //     id: 7,
  //     title: 'EFG',
  //     start_date: "2023-11-1T10:00",
  //     end_date: "2023-11-2T12:00",
  //     description: 'Test',
  //     assigned_user_name: "EFG",
  //     assigned_colour: "pink"
  //   },
  //   {
  //     id: 8,
  //     title: 'STR',
  //     start_date: "2023-12-18T14:00",
  //     end_date: "2023-12-20T17:00",
  //     description: 'Test',
  //     assigned_user_name: "STR",
  //     assigned_colour: "purple"
  //   },
  //   {
  //     id: 9,
  //     title: 'Conference2',
  //     start_date: "2023-11-18T14:00",
  //     end_date: "2023-11-20T17:00",
  //     description: 'Test2',
  //     assigned_user_name: "Demo",
  //     assigned_colour: "black"
  //   },
  //   {
  //     id: 10,
  //     title: 'Conference3',
  //     start_date: "2023-11-18T14:00",
  //     end_date: "2023-11-20T17:00",
  //     description: 'Test3',
  //     assigned_user_name: "Subharaj",
  //     assigned_colour: "#a6ff00"
  //   },
  //   // Add more events as needed
  // ];

  // const TaskDetails = useSelector((state:RootState) => state.taskData.getTaskLogs.data)

  // const TeamDetails = useSelector((state: RootState) => state.teamMemberData.getTeamMemberLogs.data)

  // console.log({ TeamDetails });
  // console.log({TaskDetails});

  const [users, setUsers] = React.useState([]);
  const [events, setEvents] = React.useState<any>([]);
  console.log({ users });
  console.log({ events });


  // Not using anywhere but it just to view/Fetch data
  React.useEffect(() => {
    // Fetch data using Axios when the component mounts
    axios.get('http://localhost:5000/api/task') // Replace with API endpoint
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    // Fetch data using Axios when the component mounts
    axios.get('http://localhost:5000/api/teammember') // Replace with API endpoint
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const filteredEvents = events.filter((item: { assigned_user_name: string; }) =>
    selectedUsers.includes(item.assigned_user_name)
  )

  console.log({filteredEvents});
  


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
