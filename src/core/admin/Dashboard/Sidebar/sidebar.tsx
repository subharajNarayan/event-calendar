import React from 'react';
import { Table } from 'reactstrap';
import TeamIndex from '../../pages/TeamMember';
import { ConnectedProps, connect, useDispatch, useSelector } from 'react-redux';
import { getTeamMemberLogsAction } from '../../../../store/modules/TeamMember/getTeamMemberLogs';
import axios from 'axios';
import { RootState } from '../../../../store/root-reducer';
import { getTaskLogsAction } from '../../../../store/modules/Tasks/getTaskLogs';

interface Props extends PropsFromRedux {
  users: { username: string; color: string }[];
  onFilterChange: (user: string[]) => void;
}

const AppSidebar = (props: Props) => {

  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleModal = () => {
    setIsOpen(!isOpen)
  }

  console.log(props.users, "TEAM MEMBER");
  

  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(getTeamMemberLogsAction())
    dispatch(getTaskLogsAction())
  }, [])

  const TeamDetails = useSelector((state: RootState) => state.teamMemberData.getTeamMemberLogs.data)
  const TaskDetails = useSelector((state: RootState) => state.taskData.getTaskLogs.data)


  console.log({ TeamDetails });
  console.log({ TaskDetails });


  const [data, setData] = React.useState([]);
  console.log({ data });

  // Not using anywhere but it just to view/Fetch data
  React.useEffect(() => {
    // Fetch data using Axios when the component mounts
    axios.get('http://localhost:5000/api/teammember') // Replace with API endpoint
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
      axios.get('http://localhost:5000/api/task') // Replace with API endpoint
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  

  // const events = TaskDetails.map((task: any) => ({
  //   // Adjust the properties based on your task details structure
  //   name: task.name,
  //   date: task.date,
  // }));

  function selectAllRows(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      const allRows = props.users.map((rowData, index) => index);
      setSelectedRows(allRows);
      // Call onFilterChange for each selected user
      props.onFilterChange(props.users.map(({ username }, index) => username))
    } else {
      setSelectedRows([]);
      props.onFilterChange([])
    }
  }

  function selectRow(event: React.ChangeEvent<HTMLInputElement>) {
    const rowIndex = Number(event.target.value);
    if (event.target.checked) {
      setSelectedRows(prevSelectedRows => [...prevSelectedRows, rowIndex]);
    } else {
      setSelectedRows(prevSelectedRows => prevSelectedRows.filter(index => index !== rowIndex));
    }

  }

  React.useEffect(() => {
    props.onFilterChange(selectedRows.map(index => props.users[index].username));
  }, [selectedRows.length]);

  return (
    <>
      <TeamIndex isOpen={isOpen} toggleModal={toggleModal} />
      <aside className="sidebar">
        <div className="pt-3" style={{ paddingBottom: "0.8rem" }}>
          <div className='sidebar-header-top align-vertical px-3 mt-2'>
            <div className='d-flex'>
              <h6 className='sidebar-text text-center text-uppercase font-bold'>Team Members
                <span className="p-2" onClick={() => toggleModal()} style={{ cursor: "pointer" }}>
                  +
                </span>
              </h6>
            </div>
            <hr />
          </div>
        </div>
        <div className="sidebar-filter-data">
          <Table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    name="selectAll"
                    id="selectAll"
                    checked={props.users.length == selectedRows.length}
                    onChange={selectAllRows} />
                </th>
                <th className='text-black'>Select All</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {props.users.map((item, index) => {
                return (
                  <tr key={index}>
                    <td >
                      <input
                        style={{ color: item.color }}
                        value={index}
                        type="checkbox"
                        id="checked-data"
                        checked={selectedRows.includes(index)}
                        onChange={selectRow} />
                    </td>
                    <td>{item.username}</td>
                    <td> <span style={{ backgroundColor: item.color, padding: "0.6rem", display: "inline-block", position: "relative", borderRadius: "50%" }}></span> </td>
                  </tr>
                )
              })}
              {/* {props.users.map((item, index) => (
                <tr key={index}>
                  <td >
                    <input
                      style={{ color: item.color }}
                      value={index}
                      type="checkbox"
                      id="checked-data"
                      checked={selectedRows.includes(index)}
                      onChange={selectRow} />
                  </td>
                  <td>{item.name}</td>
                </tr>
              ))} */}
            </tbody>
          </Table>
        </div>
      </aside>
    </>
  )
}

const mapStateToProps = () => ({

})

const mapDispatchToProps = {
  getTeamMemberLogsAction,
  getTaskLogsAction
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(AppSidebar);
