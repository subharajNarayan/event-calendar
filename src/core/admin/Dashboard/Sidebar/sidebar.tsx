import React, { useEffect } from 'react';
import { Table } from 'reactstrap';
import TeamIndex from '../../pages/TeamMember';
import { ConnectedProps, connect, useDispatch, useSelector } from 'react-redux';
import { getTeamMemberLogsAction } from '../../../../store/modules/TeamMember/getTeamMemberLogs';
import axios from 'axios';
import { RootState } from '../../../../store/root-reducer';
import { getTaskLogsAction } from '../../../../store/modules/Tasks/getTaskLogs';
import { DeleteIcon, EditIconDark } from '../../../../assets/images/xd';
import toast from '../../../../components/Notifier/Notifier';
import { deleteTeamMemberLogsAction } from '../../../../store/modules/TeamMember/deleteTeamMemberLogs';
import ConfirmationModal from '../../../../components/UI/ConfirmationModal';
import useDeleteConfirmation from '../../../../hooks/useDeleteConfirmation';

interface Props extends PropsFromRedux {
  users: { id: number; username: string; color: string }[];
  onFilterChange: (user: string[]) => void;
  // setEditData: any;
  setEditData: (data: any) => void;
}

const AppSidebar = (props: Props) => {

  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const [isOpen, setIsOpen] = React.useState(false)
  const { modal, editId, toggleModal, handleDeleteClick, resetDeleteData } = useDeleteConfirmation();
  const [teamData, setTeamData] = React.useState<{ id: number; username: string; color: string }[]>([]);
  const [fetchNewMember, setFetchNewMember] = React.useState<number>(0);
  console.log({ teamData });
  const toggleTeamModal = () => {
    setIsOpen(!isOpen)
  }

  React.useEffect(() => {
    if(!isOpen) {
      setTeamEditData({});
    }
  }, [isOpen]);
  // console.log(teamData, "TEAM MEMBER");


  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(getTeamMemberLogsAction())
    dispatch(getTaskLogsAction())
  }, [])

  // const TeamDetails = useSelector((state: RootState) => state.teamMemberData.getTeamMemberLogs.data)
  // const TaskDetails = useSelector((state: RootState) => state.taskData.getTaskLogs.data)


  // console.log({ TeamDetails });
  // console.log({ TaskDetails });




  // Not using anywhere but it just to view/Fetch data
useEffect(() => {
    // Fetch data using Axios when the component mounts
    axios.get('https://kyush.pythonanywhere.com/accounts/api/team-members/') // Replace with API endpoint
      .then((response) => {
        setTeamData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [fetchNewMember]);

  function selectAllRows(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      const allRows = teamData.map((rowData, index) => index);
      setSelectedRows(allRows);
      // Call onFilterChange for each selected user
      // props.onFilterChange(teamData.map(({ username }, index) => username))
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
    if(teamData.length > 0) {
      const allRows = teamData.map((rowData, index) => index);
      setSelectedRows(allRows);
    }
  }, [teamData.length])

  React.useEffect(() => {
    props.onFilterChange(selectedRows.map(index => teamData[index].username));
  }, [selectedRows.length]);

  const handleTeamMemberAction = async () => {
    const res = await props.deleteTeamMemberLogsAction(editId);

    if (res.status === 200 || res.status === 201 || res.status === 204) {
      toast.success("Data Deleted Successful...!")
      resetDeleteData();
      // setTeamData();
    } else {
      toast.error("Server Error")
    }
  }

  const [TeamData, setTeamEditData] = React.useState<any>();

  // console.log(TeamData, "sidebarTeam");
  
  const handleEditClick = (data: any) => {
    setTeamEditData(data);
    toggleTeamModal();
  }

  const handleTeamMemberAdd = () => {
    setFetchNewMember(fetchNewMember + 1);
  };
  

  return (
    <>
      <TeamIndex isOpen={isOpen} toggleModal={toggleTeamModal} TeamData={TeamData} success={handleTeamMemberAdd}/>
      <aside className="sidebar">
        <div className="pt-3" style={{ paddingBottom: "0.8rem" }}>
          <div className='sidebar-header-top align-vertical px-3 mt-2'>
            <div className='d-flex'>
              <h6 className='sidebar-text text-center text-uppercase font-bold'>Team Members
                <span className="p-2" onClick={() => toggleTeamModal()} style={{ cursor: "pointer" }}>
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
                    checked={teamData.length == selectedRows.length}
                    onChange={selectAllRows} />
                </th>
                <th className='text-black'>Select All</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {teamData.map((item, index) => {
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
                    <td className='action d-flex align-item-center'>
                      <div role='button' className="mr-0" onClick={() => {
                        // props.setEditData(item);
                        handleEditClick(item)
                      }}>
                        <img src={EditIconDark} alt="edit" width="10px"  className='mx-2'/>
                      </div>
                      <div role='button' className="mr-0" onClick={() => {
                        handleDeleteClick(item.id)
                      }}>
                        <img src={DeleteIcon} alt="delete" width="10px" className='mx-2'/>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </aside>
      <ConfirmationModal open={modal}
        handleModal={() => toggleModal()}
        handleConfirmClick={() => handleTeamMemberAction()} />
    </>
  )
}

const mapStateToProps = () => ({

})

const mapDispatchToProps = {
  getTeamMemberLogsAction,
  getTaskLogsAction,
  deleteTeamMemberLogsAction,
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(AppSidebar);
