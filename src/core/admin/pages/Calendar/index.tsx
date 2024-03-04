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
import useDeleteConfirmation from '../../../../hooks/useDeleteConfirmation';
import { deleteTaskLogsAction } from '../../../../store/modules/Tasks/deleteTaskLogs';

const localizer = momentLocalizer(moment);


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
  success: () => void;
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
            <select onChange={handleTaskStatusChange} className='form-select mx-2'>
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
  // const [currentDate, setCurrentDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [unfilteredEvents, setUnfilteredEvents] = useState<Event[]>([]);
  const [listCurrentView, setListCurrentView] = useState<'month' | 'week' | 'day'>('day');

  const [isDate, setIsDate] = useState<string>(moment().format('dddd, MMM DD'));
  const [isWeek, setIsWeek] = useState<any>();

  // console.log({ unfilteredEvents });
  // console.log({ events });

  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<Event | null>(null);

  const { modal, editId, resetDeleteData } = useDeleteConfirmation();



  const [initialData, setInitialData] = useState({
    task_complete: selectedDetails?.task_complete,
  });

  const [isTaskComplete, setIsTaskComplete] = useState<boolean>(
    selectedDetails?.task_complete! ?? false
  );
  // console.log({ isTaskComplete });

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
          task_complete: !selectedDetails.task_complete,
          start_date: moment(selectedDetails.start_date).format('YYYY-MM-DD HH:mm:ss'),
          end_date: moment(selectedDetails.end_date).format('YYYY-MM-DD HH:mm:ss'),
        };

        const res = await props.updateTaskLogsAction(selectedDetails.id, updatedTask);

        console.log({ res });


        if (res.status === 200) {
          const updatedTaskData = res.data;

          if (updatedTaskData) {
            setInitialData({ task_complete: updatedTaskData.task_complete });
            setIsTaskComplete(!selectedDetails.task_complete); // Update the local state directly
            toast.success('Task status updated successfully...!');
            props.fetchSuccess();
            // Update the taskStatus state to an empty string
            setTaskStatus('');
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


  React.useEffect(() => {
    setUnfilteredEvents(events);

  }, [events.length, props.fetchSuccess]);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);

    // Set initial data for the form
    const currentDate = selectedDate || moment(); // Use selectedDate if available, or use the current date

    const selectedStartDate = moment(currentDate);
    const selectedEndDate = moment(currentDate).add(1, 'hours');

    const currentHour = moment().hour();
    const currentMinute = moment().minute();

    // Set the selected date's hours and minutes to the current time
    selectedStartDate.set({ hour: currentHour, minute: currentMinute });
    selectedEndDate.set({ hour: currentHour + 1, minute: currentMinute });

    const event: DBEvent = {
      id: 0,
      title: '',
      description: '',
      start_date: moment(selectedStartDate).format('YYYY-MM-DD HH:mm'),
      end_date: moment(selectedEndDate).format('YYYY-MM-DD HH:mm'),
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
    const selectedStartDate = moment(slotInfo.start);
    const selectedEndDate = moment(slotInfo.start).add(1, 'hours');

    const currentHour = moment().hour();
    const currentMinute = moment().minute();

    // Set the selected date's hours and minutes to the current time
    selectedStartDate.set({ hour: currentHour, minute: currentMinute });
    selectedEndDate.set({ hour: currentHour + 1, minute: currentMinute });

    setSelectedDate(slotInfo.start);
    const event: DBEvent = {
      id: 0,
      title: '',
      description: '',
      // start_date: moment(slotInfo.start).format('YYYY-MM-DD HH:mm:ss'),
      // end_date: moment(slotInfo.end).format('YYYY-MM-DD HH:mm:ss'),
      start_date: selectedStartDate.format('YYYY-MM-DD HH:mm:ss'),
      end_date: selectedEndDate.format('YYYY-MM-DD HH:mm:ss'),
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
    setIsDate(moment().format('dddd, MMM DD'));
  };

  React.useEffect(() => {
    const startOfWeek = moment().startOf('week').format('MMM DD');
    const endOfWeek = moment().endOf('week').format('DD');

    setIsWeek(startOfWeek + ' – ' + endOfWeek);
    console.log({ startOfWeek, endOfWeek });
  }, []);

  const switchToCalendarView = () => {
    setCurrentView('calendar');
    setListCurrentView('day');

    // setUnfilteredEvents(getViewEvents('month'));
  };

  const switchToListView = () => {
    console.log('clicked');

    setCurrentView('list');
    setListCurrentView('day');
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

  const getViewEvents = (currentViewOverride: string = '') => {

    // console.log({currentDate, currentMonth}, ',,,,,,,,,,,,,,,');
    let date = moment(currentMonth, 'MMMM YYYY'); // January 2023

    console.log({ currentMonth });

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
          date = moment(); // Set the date to the current date
          return moment(event.start_date).isSame(date, 'week');
        })
      }
      case 'day': {
        date = moment(); // Set the date to the current date
        return events.filter(event => {
          return moment(event.start_date).isSame(date, 'day');
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
        toggleDetailsModal();
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
      if (column === 'assigned_user_name' || column === 'title') {
        // Special case for 'assigned_user_name' column
        return newSortOrder === 'asc'
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column]);
      } else {
        // Default case for numeric or other types
        return newSortOrder === 'asc'
          ? a[column] > b[column]
            ? 1
            : a[column] < b[column]
              ? -1
              : 0
          : b[column] > a[column]
            ? 1
            : b[column] < a[column]
              ? -1
              : 0;
      }
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
          onSelectEvent={handleDetailEvent}
          views={['month', 'week', 'day']}
          defaultView='day'
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
              setListCurrentView('month');
            }}
            goToWeekView={() => {
              setListCurrentView('week');
            }}
            goToDayView={() => {
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
          <div className="selected-date">
            <h2>
              {listCurrentView === 'day' ? (
                <span>{isDate}</span>
              ) : listCurrentView === 'week' ? (
                <span>{isWeek}</span>
              ) : (
                <> </>
              )}
              {listCurrentView === 'month' ? (
                <span>{currentMonth}</span>
              ) : (
                <></>
              )}
            </h2>
          </div>
          <div className='container-fluid'>
            <div className='table-responsive'>
              <Table>
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
                  {unfilteredEvents && unfilteredEvents.length > 0 ? (
                    unfilteredEvents.map((item: any) => (
                      <tr key={item.id} onClick={() => handleDetailEvent(item)}>
                        <td>{item.title}</td>
                        <td>{moment(item.start_date).format('MMM D, YYYY hh:mm a')}</td>
                        <td>{moment(item.end_date).format('MMM D, YYYY hh:mm a')}</td>
                        <td>{item.assigned_user_name}</td>
                      </tr>
                    ))
                  ) : (
                    <div className="no-data mt-3" style={{ whiteSpace: 'nowrap' }}>
                      <span >No Data Available</span>
                    </div>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      )}
      {selectedDetails &&
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
                <p style={{ fontSize: '12px', marginBottom: '0.5rem' }}>
                  {/* {moment.utc(selectedDetails.start_date).format('DD MMM YYYY hh:mm A')} */}
                  {moment(selectedDetails.start_date).format('DD MMM YYYY hh:mm A')}
                  <strong style={{ fontSize: '14px' }}> TO </strong>
                  {moment(selectedDetails.end_date).format('DD MMM YYYY hh:mm A')}
                </p>
                <p>
                  <strong> Location: </strong>
                  <br />
                  {selectedDetails.location}
                </p>
                <hr />
                <text>{selectedDetails.description}</text>
              </div>
              <hr />
              <div className="date-time">
                <p className='d-flex align-items-center '>Assigned To: {selectedDetails.assigned_user_name}</p>
              </div>
              <Form selectedEvent={selectedDetails} toogleModal={toggleDetailsModal} />
            </div>
          </ModalBody>
        </Modal>
      }

      {selectedDate && <CalendarIndex isOpen={isOpen} toggleModal={toggleModal} fetchSuccess={props.fetchSuccess} />}
      {selectedEvent && !isFormOpen && <CalendarIndex isOpen={isOpen} data={selectedEvent} toggleModal={toggleModal} fetchSuccess={props.fetchSuccess} />}
      {isFormOpen && <CalendarIndex isOpen={!isOpen} data={selectedEvent} toggleModal={toggleForm} fetchSuccess={props.fetchSuccess} />}
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
