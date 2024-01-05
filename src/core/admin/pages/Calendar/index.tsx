import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CalendarIndex from './CalendarForm';
import { Table } from 'reactstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faCheck, faList } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
// import AdminIndex from './AdminModal';
import { DeleteIcon, EditIconDark } from '../../../../assets/images/xd';
import Form from './AdminComment/Form';
import { RootState } from '../../../../store/root-reducer';
import { ConnectedProps, connect } from 'react-redux';
import { updateTaskLogsAction } from '../../../../store/modules/Tasks/updateTaskLogs';
import toast from '../../../../components/Notifier/Notifier';
import * as Yup from 'yup';
import useDeleteConfirmation from '../../../../hooks/useDeleteConfirmation';
import { deleteTaskLogsAction } from '../../../../store/modules/Tasks/deleteTaskLogs';

const localizer = momentLocalizer(moment);

const validationSchema = Yup.object({});

interface Event {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  description: string; // Include this line
  assigned_user_name: string;
  // assigned_colour: string;
  assigned_user_colour: string;
  task_complete: boolean;
  status: string;
  location: string;
  assignee: string;
}


interface DBEvent {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  description: string;
  assigned_user_name: string;
  assigned_user_colour: string;
  task_complete: boolean;
  status: string;
  location: string;
}


interface Props extends PropsFromRedux {
  events: Event[];
  allEvents: Event[];
  fetchSuccess: () => void;
}

const CustomToolbar: React.FC<{
  toolbar: any;
  currentView: 'month' | 'week' | 'day';
  view: 'calendar' | 'list';
  goToMonthView: () => void;
  goToWeekView: () => void;
  goToDayView: () => void;
  switchToCalendarView: () => void;
  switchToListView: () => void;
  showAllButton: boolean;
  showYearDate: boolean;
  toggleForm: () => void;
  handleTaskStatusChange: (e: any) => void;
  taskStatus: string;
}> = ({
  toolbar,
  currentView,
  view,
  goToMonthView,
  goToWeekView,
  goToDayView,
  switchToCalendarView,
  switchToListView,
  showAllButton,
  showYearDate,
  toggleForm,
  handleTaskStatusChange,
  taskStatus
}) => {
    return (
      <div className='calendar-view'>
        <div className='toolbar-heading d-flex'>
          <div className="toolbar-heading-top">
            <h4>Task Calendar</h4>
          </div>
          <div className="select-status d-flex align-items-center">
            <label htmlFor="" className='mt-1'>Status</label>
            <select onChange={handleTaskStatusChange} className='form-control mx-2'>
              <option value="" selected={taskStatus === ''}>All</option>
              <option value="done" selected={taskStatus === "done"}>Done</option>
              <option value="overdue" selected={taskStatus === "overdue"}>Overdue</option>
              <option value="active" selected={taskStatus === "active"}>Active</option>
            </select>
          </div>
          <div className="toolbar-view-right d-flex">
            <div className="toolbar-calendar-list px-3">
              <button className={classnames({ active: view === "calendar" })}
                onClick={switchToCalendarView}>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </button>
              <button className={classnames({ active: view === "list" })}
                onClick={switchToListView}>
                <FontAwesomeIcon icon={faList} />
              </button>
            </div>
            <div className="toolbar-weekand">
              <button
                className={classnames({ active: currentView === 'month' })}
                onClick={goToMonthView}
              >
                Month
              </button>
              <button
                className={classnames({ active: currentView === 'week' })}
                onClick={goToWeekView}
              >
                Week
              </button>
              <button
                className={classnames({ active: currentView === 'day' })}
                onClick={goToDayView}
              >
                Day
              </button>
            </div>
          </div>
        </div>
        <hr />
        {showAllButton && (
          <div className="list-view mb-3">
            {/* <div className="toolbar-all px-3">
              <p></p>
            </div> */}
            <div className="toolbar-add text-right">
              <button onClick={toggleForm}> + </button> &nbsp; Add Task
            </div>
          </div>
        )}
        {showYearDate && toolbar.onNavigate && (
          <div className="toolbar-year-date d-flex">
            <button onClick={() => toolbar.onNavigate('PREV')}>  Back</button>
            <h2>{toolbar.label}</h2>
            <button onClick={() => toolbar.onNavigate('NEXT')}> Next</button>
          </div>
        )}
      </div>
    );
  };


// const CIndex: React.FC<CalendarProps> = ({ events, allEvents }) => {
const CIndex = (props: Props) => {

  const { events, allEvents } = props;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<DBEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<string>(moment().format('MMMM YYYY'));
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('calendar');
  // const [currentView, setCurrentView] = useState<'calendar' | 'list' | 'month' | 'week' | 'day'>('calendar');
  const [currentDate, setCurrentDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [unfilteredEvents, setUnfilteredEvents] = useState<Event[]>([]);
  const [listCurrentView, setListCurrentView] = useState<'month' | 'week' | 'day'>('month');

  console.log({ unfilteredEvents });
  console.log({ events });



  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<Event | null>(null);

  const { modal, editId, resetDeleteData } = useDeleteConfirmation();


  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | ''>(''); //For sorting AssigneTo column

  // const handleSortChange = (e: any) => {
  //   setSortDirection(e.target.value as 'asc' | 'desc' | '');
  // };

  // const handleSortChange = (e: any) => {
  //   const selectedSortDirection = e.target.value as 'asc' | 'desc' | '';

  //   if (selectedSortDirection === '') {
  //     // If "All" is selected, update events based on the current month
  //     const currentMonthEvents = getViewEvents();
  //     console.log({ currentMonthEvents });

  //     setUnfilteredEvents(currentMonthEvents);
  //   } else {
  //     // If other sorting options are selected, update the sort direction
  //     setUnfilteredEvents([...unfilteredEvents].sort((a, b) => {
  //       const sortFactor = selectedSortDirection === 'asc' ? 1 : -1;
  //       const assignedToA = a.assigned_user_name?.toLowerCase() || '';
  //       const assignedToB = b.assigned_user_name?.toLowerCase() || '';
  //       return assignedToA.localeCompare(assignedToB) * sortFactor;
  //     }));
  //   }

  //   setSortDirection(selectedSortDirection);
  // };

  const handleSortChange = (e: any) => {
    const selectedSortDirection = e.target.value as 'asc' | 'desc' | '';

    if (selectedSortDirection === '') {
      // If "All" is selected, update events based on the current month
      const currentMonth = new Date().getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
      const currentMonthEvents = getViewEvents().filter(event => {
        const eventMonth = new Date(event.start_date).getMonth() + 1;
        return eventMonth === currentMonth;
      });

      console.log({ currentMonthEvents });
      setUnfilteredEvents(currentMonthEvents);
    } else {
      // If other sorting options are selected, update the sort direction
      setUnfilteredEvents([...unfilteredEvents].sort((a, b) => {
        const sortFactor = selectedSortDirection === 'asc' ? 1 : -1;
        const assignedToA = a.assigned_user_name?.toLowerCase() || '';
        const assignedToB = b.assigned_user_name?.toLowerCase() || '';
        return assignedToA.localeCompare(assignedToB) * sortFactor;
      }));
    }

    setSortDirection(selectedSortDirection);
  };



  const [initialData, setInitialData] = useState({
    task_complete: selectedDetails?.task_complete,
  });

  console.log({ initialData });


  // const taskComplete = events.map((item) => item.task_complete);

  // Make sure this code is executed before any usage of isTaskComplete
  // const taskComplete = selectedDetails?.task_complete;
  console.log({ selectedDetails });

  const [isTaskComplete, setIsTaskComplete] = useState<boolean>();
  console.log({ isTaskComplete });

  React.useEffect(() => {
    if (selectedDetails) {
      const taskComplete = selectedDetails.task_complete;
      const initialIsTaskComplete = taskComplete;
      setIsTaskComplete(initialIsTaskComplete);
    }
  }, [selectedDetails]);

  const handleTickButtonClick = async () => {
    try {
      if (selectedDetails) {
        const updatedTask = {
          ...selectedDetails,
          task_complete: (!isTaskComplete),
        };

        const res = await props.updateTaskLogsAction(selectedDetails.id, updatedTask);

        if (res.status === 200) {
          const updatedTaskData = res.data;

          // Check if updatedTaskData is not null before accessing its properties
          if (updatedTaskData) {
            setInitialData({ task_complete: updatedTaskData.task_complete });
            toast.success('Task updated successfully...!');
          } else {
            toast.error('Updated task data is null.');
          }
        } else {
          toast.error('Oops... Something is Wrong!');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Oops... Something went wrong!');
    }
  };




  // React.useEffect(() => {
  //   setIsTaskComplete(initialData.task_complete === 'true');
  // }, [initialData.task_complete]);

  // const handleTickButtonClick = async () => {
  //   console.log("ChECKED");

  //   if (selectedDetails) {
  //     const updatedEvent = {
  //       ...selectedDetails,
  //       task_complete: !isTaskComplete,
  //     };

  //     // Assuming your updateTaskLogsAction returns a Promise
  //     try {
  //       // Dispatch the updateTaskLogsAction with the updated event
  //       await props.updateTaskLogsAction(updatedEvent.id, updatedEvent);

  //       // Update local state to reflect the new task completion status
  //       setSelectedDetails({
  //         ...selectedDetails,
  //         task_complete: !isTaskComplete,
  //       });
  //       setIsTaskComplete(!isTaskComplete);

  //       toast.success('Task updated successfully...!');
  //     } catch (error) {
  //       toast.error('Oops...Something is Wrong!');
  //     }
  //   }
  // };


  // const {
  //   values,
  //   errors,
  //   touched,
  //   handleSubmit,
  //   handleChange,
  //   handleBlur,
  // } = useFormik({
  //   initialValues: initialData,
  //   validationSchema: validationSchema,
  //   onSubmit: async (submitValue, { resetForm }) => {
  //     // Your existing code for submitting the form
  //   },
  // });


  React.useEffect(() => {
    setUnfilteredEvents(events);

  }, [events.length, props.fetchSuccess]);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    // Set initial data for the form
    const currentDate = selectedDate || moment(); // Use selectedDate if available, or use the current date
    const event: DBEvent = {
      id: 0,
      title: '',
      description: '',
      start_date: moment(currentDate).format('YYYY-MM-DD HH:mm:ss'),
      end_date: moment(currentDate).format('YYYY-MM-DD HH:mm:ss'),
      assigned_user_name: '',
      assigned_user_colour: '',
      task_complete: false,
      status: 'active',
      location: '',
    };
    setSelectedEvent(event);
  };

  const toggleDetailsModal = () => {
    setDetailsModal(!detailsModal);
  }
  const toggleModal = () => {
    setIsOpen(!isOpen);
    setSelectedDate(null); // Reset selectedDate when closing the modal
  };


  const eventStyleGetter = (event: Event) => {
    return {
      style: {
        backgroundColor: event.assigned_user_colour,
        color: 'white',
      },
    };
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedDate(slotInfo.start);
    const event: DBEvent = {
      start_date: moment(slotInfo.start).format('YYYY-MM-DD HH:mm:ss'),
      id: 0,
      title: '',
      description: '',
      // end_date: '',
      end_date: moment(slotInfo.end).format('YYYY-MM-DD HH:mm:ss'),
      assigned_user_name: '',
      assigned_user_colour: '',
      task_complete: false,
      status: 'active',
      location: '',
    };
    setSelectedEvent(event);
    toggleModal();
  };


  const handleSelectEvent = (event: Event) => {
    let dbEvent: DBEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      start_date: moment(event.start_date).format('YYYY-MM-DD HH:mm:ss'),
      end_date: event.end_date ? moment(event.end_date).format('YYYY-MM-DD HH:mm:ss') : '',
      assigned_user_name: event.assigned_user_name,
      assigned_user_colour: event.assigned_user_colour,
      task_complete: event.task_complete,
      status: event.status,
      location: event.location,
      // assigned_colour: event.assigned_colour
    }
    setSelectedEvent(dbEvent);
    setSelectedDate(null);
    console.log({ event });
    toggleModal();
    setDetailsModal(false);
  };

  const handleDetailEvent = (event: any) => {
    setSelectedDetails(event);
    setDetailsModal(true);
  }

  const handleNavigate = (date: Date) => {
    setCurrentMonth(moment(date).format('MMMM YYYY'));
  };

  const switchToCalendarView = () => {
    setCurrentView('calendar');
    setListCurrentView('month');

    // setUnfilteredEvents(getViewEvents('month'));
  };

  const switchToListView = () => {
    console.log('clicked');

    setCurrentView('list');
    setListCurrentView('month');
    // setUnfilteredEvents(getViewEvents('month'));
  };

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedDate(null);
      setSelectedEvent(null);
    }
  }, [isOpen]);

  const [taskStatus, setTaskStatus] = React.useState<string>('');

  React.useEffect(() => {
    let eventlist: Event[] = [];

    if (currentView == 'calendar') {
      eventlist = getViewEvents();
    }
    if (currentView == 'list') {
      eventlist = getViewEvents(listCurrentView);
    }
    switch (taskStatus) {
      case 'done': {
        setUnfilteredEvents(eventlist.filter((event: any) => {
          return Boolean(event.task_complete);
        }))
        break;
      }
      case 'overdue': {
        setUnfilteredEvents(eventlist.filter((event: any) => {
          return event.status === 'overdue';
        }))
        break;
      }
      case 'active': {
        setUnfilteredEvents(eventlist.filter((event: any) => {
          return event.status === 'active';
        }))
        break;
      }
      default: {
        setUnfilteredEvents(eventlist);
      }
    }
  }, [currentMonth, taskStatus, listCurrentView, currentView]);

  // React.useEffect(() => {

  //   if(currentView == 'calendar') {
  //     setUnfilteredEvents(getViewEvents());
  //   }
  //   if(currentView == 'list') {
  //     setUnfilteredEvents(getViewEvents(listCurrentView));
  //   }

  // }, []);

  const getViewEvents = (currentViewOverride: string = '') => {

    // console.log({currentDate, currentMonth}, ',,,,,,,,,,,,,,,');
    let date = moment(currentMonth, 'MMMM YYYY'); // January 2023

    switch (currentViewOverride) {
      case 'month': {
        return events.filter(event => {
          return moment(event.start_date).isBetween(
            date.startOf('month').format('YYYY-MM-DD'),
            date.endOf('month').format('YYYY-MM-DD')
          );
        });
      }
      case 'week': {
        return events.filter(event => {
          return moment(event.start_date).isBetween(
            date.startOf('week').format('YYYY-MM-DD'),
            date.endOf('week').format('YYYY-MM-DD')
          );
        })
      }
      case 'day': {
        return events.filter(event => {
          return moment(event.start_date).isBetween(
            date.startOf('day').format('YYYY-MM-DD 00:00:00'),
            date.endOf('day').format('YYYY-MM-DD 23:59:59')
          );
        })
      }
      default: {
        return events
      }
    }
  }



  const handleDeleteClick = async (id: number) => {
    // Assuming your deleteTaskLogsAction returns a Promise
    try {
      const res = await props.deleteTaskLogsAction(id);

      if (res.status === 200 || res.status === 201 || res.status === 204) {
        toast.success("Data Deleted Successfully...!");
        resetDeleteData();
        toggleDetailsModal(); // Close the details modal
        toggleModal(); // Open the confirmation modal
        props.fetchSuccess();
      } else {
        toast.error("Server Error");
      }
    } catch (error) {
      toast.error("Oops... Something is Wrong!");
    }
  };



  const [sortColumn, setSortColumn] = useState<keyof Event>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof Event) => {
    const newSortOrder = column === sortColumn ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';

    const sortedEvents = [...unfilteredEvents].sort((a, b) => {
      if (a[column] < b[column]) return newSortOrder === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return newSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setSortColumn(column);
    setSortOrder(newSortOrder);
    // Update the data
    setUnfilteredEvents(sortedEvents);
  };

  const renderArrow = (column: keyof Event) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? ' ↑' : ' ↓';
    }
    return ' ↑↓'; // Both arrows initially displayed
  };

  // const [sortColumn, setSortColumn] = useState<keyof Event>('title');
  // const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // const handleSort = (column: keyof Event) => {
  //   const newSortOrder = column === sortColumn ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';

  //   const sortedEvents = [...unfilteredEvents].sort((a, b) => {
  //     if (a[column] < b[column]) return newSortOrder === 'asc' ? -1 : 1;
  //     if (a[column] > b[column]) return newSortOrder === 'asc' ? 1 : -1;
  //     return 0;
  //   });

  //   setSortColumn(column);
  //   setSortOrder(newSortOrder);
  //   // Update the data
  //   setUnfilteredEvents(sortedEvents);
  // };

  // const renderArrow = (column: keyof Event) => {
  //   if (sortColumn === column) {
  //     return sortOrder === 'asc' ? '↑' : '↓';
  //   }
  //   return null;
  // };

  return (
    <div>
      {['calendar'].indexOf(currentView) > -1 && (
        <Calendar
          localizer={localizer}
          events={unfilteredEvents}
          startAccessor="start_date"
          endAccessor="end_date"
          style={{ height: 600 }}
          popup
          eventPropGetter={eventStyleGetter}
          selectable={true}
          onSelectSlot={handleSelectSlot}
          // onSelectEvent={handleSelectEvent}
          onSelectEvent={handleDetailEvent}
          views={['month', 'week', 'day']}
          // onView={(view:any) => setCurrentView(view)}
          onNavigate={handleNavigate}
          components={{
            toolbar: (toolbarProps: any) => (
              <CustomToolbar
                toolbar={toolbarProps}
                currentView={listCurrentView}
                view={currentView}
                goToMonthView={() => {
                  setListCurrentView('month');
                  toolbarProps.onView('month');
                }}
                goToWeekView={() => {
                  setListCurrentView('week');
                  toolbarProps.onView('week')
                }}
                goToDayView={() => {
                  setListCurrentView('day');
                  toolbarProps.onView('day');
                }}
                switchToCalendarView={switchToCalendarView}
                switchToListView={switchToListView}
                showAllButton={false}
                showYearDate={true}
                toggleForm={toggleForm}
                taskStatus={taskStatus}
                handleTaskStatusChange={(e) => {
                  setTaskStatus(e.target.value);
                }}
              />
            ),
          }}
        />
      )}

      {currentView === 'list' && (
        <div>
          <CustomToolbar
            toolbar={{ label: currentMonth, onNavigate: handleNavigate }}
            currentView={listCurrentView}
            view={currentView}
            goToMonthView={() => {
              // setUnfilteredEvents(getViewEvents('month'));
              setListCurrentView('month');
            }}
            goToWeekView={() => {
              // setUnfilteredEvents(getViewEvents('week'));
              setListCurrentView('week');
            }}
            goToDayView={() => {
              // setUnfilteredEvents(getViewEvents('day'));
              setListCurrentView('day');
            }}
            taskStatus={taskStatus}
            handleTaskStatusChange={(e) => {
              setTaskStatus(e.target.value);
            }}
            switchToCalendarView={switchToCalendarView}
            switchToListView={switchToListView}
            showAllButton={true}
            showYearDate={false}
            toggleForm={toggleForm}
          />
          {/* <div className="row sorting">
            <div className="col-lg-2">
              <div className="sorting-data mt-3 d-flex align-items-baseline">
                <label htmlFor="" style={{whiteSpace: 'nowrap'}}>
                  Sort By:
                </label>
                <select
                  name=""
                  id=""
                  className='form-select outline-none box-shadow-none mx-2'
                  onChange={handleSortChange}
                  value={sortDirection}
                >
                  <option value="">All</option>
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                </select>
              </div>
            </div>
          </div> */}
          <Table>
            {/* <thead>
              <tr>
                <th>Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Assigned To</th>
              </tr>
            </thead> */}
            <thead>
              <tr>
                <th onClick={() => handleSort('title')}>
                  Title
                  <span className="arrow">{renderArrow('title')}</span>
                </th>
                <th onClick={() => handleSort('start_date')}>
                  Start Date
                  <span className="arrow">{renderArrow('start_date')}</span>
                </th>
                <th onClick={() => handleSort('end_date')}>
                  End Date
                  <span className="arrow">{renderArrow('end_date')}</span>
                </th>
                <th onClick={() => handleSort('assigned_user_name')}>
                  Assigned To
                  <span className="arrow">{renderArrow('assigned_user_name')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {unfilteredEvents.map((item: any) => (
                <tr key={item.id} onClick={() => handleDetailEvent(item)}>
                  <td>{item.title}</td>
                  <td>{moment(item.start_date).format('MMM D, YYYY')}</td>
                  <td>{moment(item.end_date).format('MMM D, YYYY hh:mm a')}</td>
                  <td>{item.assigned_user_name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {selectedDetails &&
        // <AdminIndex isOpen={detailsModal} toggleModal={toggleDetailsModal} />
        <Modal isOpen={detailsModal} toggle={toggleDetailsModal}>
          <ModalHeader toggle={toggleDetailsModal}>
            {selectedDetails ? selectedDetails.title : ''}
            <div className="right-side-btn " style={{ position: "absolute", right: "47px", top: "14px" }}>
              <div className="action d-flex align-item-center">
                <div role='button' className="mr-0" title='Edit' onClick={() => handleSelectEvent(selectedDetails)}
                >
                  <img src={EditIconDark} alt="edit" width="15px" className='mx-2' />
                </div>
                <div role='button' className="mr-0" title='Delete' onClick={() => handleDeleteClick(selectedDetails.id)}>
                  <img src={DeleteIcon} alt="delete" width="15px" className='mx-2' />
                </div>
                <button className="tick-button ml-2" title='Done Mark' style={{ right: "68px" }} onClick={handleTickButtonClick}>
                  {isTaskComplete ? (
                    <div className='tick-true'>
                      <FontAwesomeIcon icon={faCheck} />
                    </div>
                  ) : (
                    <div className='tick-false'>
                      <FontAwesomeIcon icon={faCheck} />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="event-body">
              <div className="description">
                <p style={{ fontSize: '12px' }}>{moment(selectedDetails.start_date).format('DD MMM YYYY hh:mm A')}</p>
                <text>{selectedDetails.description}</text>
              </div>
              <hr />
              <div className="date-time">
                <p className='d-flex align-items-center '>Assignee: {selectedDetails.assignee}</p>
              </div>
              {/* <Form selectedEvent={props.selectedEvent} toggleModal={props.toggleModal} /> */}
              <Form selectedEvent={selectedDetails} toogleModal={toggleDetailsModal} />
            </div>
          </ModalBody>
        </Modal>
      }

      {selectedDate && <CalendarIndex isOpen={isOpen} toggleModal={toggleModal} fetchSuccess={props.fetchSuccess} />}
      {selectedEvent && !isFormOpen && <CalendarIndex isOpen={isOpen} data={selectedEvent} toggleModal={toggleModal} fetchSuccess={props.fetchSuccess} />}
      {isFormOpen && <CalendarIndex isOpen={!isOpen} data={selectedEvent} toggleModal={toggleForm} fetchSuccess={props.fetchSuccess} />}

      {/* <ConfirmationModal open={modal}
        handleModal={() => toggleModal()}
        handleConfirmClick={() =>handleDeleteClick( )} /> */}
    </div>
  );
};


const mapStateToProps = (state: RootState) => ({

})

const mapDispatchToProps = {
  updateTaskLogsAction,
  deleteTaskLogsAction
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(CIndex);
