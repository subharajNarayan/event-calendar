import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, ModalBody, ModalHeader, Table } from 'reactstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faList } from '@fortawesome/free-solid-svg-icons';
import TeamIndex from './userModal';
import Form from './userModal/Form';
import useAuthentication from '../../../../services/authentication/AuthService';
import { ConnectedProps, connect, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useStateManager } from 'react-select';
// import Form from './comment';

const localizer = momentLocalizer(moment);

interface Event {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  description: string;
  assigned_user_name: string;
  assigned_colour: string;
  status: string;
  task_complete: boolean;
}

interface CalendarProps extends PropsFromRedux {
  events: any;
}

const CustomToolbar: React.FC<{
  toolbar: any;
  currentView: 'calendar' | 'list';
  goToMonthView: () => void;
  goToWeekView: () => void;
  goToDayView: () => void;
  switchToCalendarView: () => void;
  switchToListView: () => void;
  showAllButton: boolean;
  showYearDate: boolean;
  listView: 'month' | 'week' | 'day';
  handleTaskStatusChange: (e: any) => void;
  taskStatus: string;
}> = ({
  toolbar,
  currentView,
  goToMonthView,
  goToWeekView,
  goToDayView,
  switchToCalendarView,
  switchToListView,
  showAllButton,
  showYearDate,
  listView,
  handleTaskStatusChange,
  taskStatus,
}) => {
    return (
      <div className='calendar-view'>
        <div className='toolbar-heading d-flex'>
          <div className="toolbar-heading-top">
            <h4>Task Calendar</h4>
          </div>
          <div className="toolbar-select ">
            <div className="form-group d-flex align-items-baseline p-1">
              <label htmlFor="">Select</label>
              <select name="" id="" className='form-control mx-2' onChange={handleTaskStatusChange}>
                <option value="" selected={taskStatus === ''}>All</option>
                <option value="done" selected={taskStatus === "done"}>Done</option>
                <option value="overdue" selected={taskStatus === "overdue"}>OverDue</option>
                <option value="active" selected={taskStatus === "active"}>Active</option>
              </select>
            </div>
          </div>
          <div className="toolbar-view-right d-flex">
            <div className="toolbar-calendar-list px-3">
              <button className={classnames({ active: currentView === "calendar" })}
                onClick={switchToCalendarView}>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </button>
              <button className={classnames({ active: currentView === "list" })}
                onClick={switchToListView}>
                <FontAwesomeIcon icon={faList} />
              </button>
            </div>
            <div className="toolbar-weekand">
              <button
                className={classnames({ active: listView === 'month' })}
                onClick={goToMonthView}
              >
                Month
              </button>
              <button
                className={classnames({ active: listView === 'week' })}
                onClick={goToWeekView}
              >
                Week
              </button>
              <button
                className={classnames({ active: listView === 'day' })}
                onClick={goToDayView}
              >
                Day
              </button>
            </div>
          </div>
        </div>
        <hr />
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



// interface Props extends PropsFromRedux {

// }

const TeamCalIndex = (props: CalendarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<string>(moment().format('MMMM YYYY'));
  const [currentDate, setCurrentDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('calendar');
  const [listView, setListView] = useState<'month' | 'week' | 'day'>('month');
  // const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [unfilteredEvents, setUnfilteredEvents] = useState<Event[]>([]);
  const [taskStatus, setTaskStatus] = useState<string>('');

  const { isAuthenticated, getAuthUser } = useAuthentication();
  const user = getAuthUser();

  const [events, setEvents] = useState<any>([]);

  //    // Not using anywhere but it just to view/Fetch data
  React.useEffect(() => {
    // Fetch data using Axios when the component mounts
    axios.get('https://kyush.pythonanywhere.com/accounts/api/tasks') // Replace with API endpoint
      .then((response) => {
        let initialEvents = response.data.map((event: any) => ({
          ...event,
          start_date: moment(event.start_date).toDate(),
          end_date: moment(event.end_date).toDate()
        }));

        initialEvents = initialEvents.filter((event: any) => {
          // console.log(event.assigned_user_name, user.username);
          return event.assigned_user_name?.toLowerCase() == user.username.toLowerCase();
        });

        setEvents(initialEvents);
        setUnfilteredEvents(initialEvents);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  //   // auth id
  //   // /server/getallEvents/{username}
  //   // dispatch event fetch request
  //   if (user && user.role == 'Team_Member') {
  //     let initialEvents = events.filter(event => {
  //       console.log(event.assigned_user_name, user.username);

  //       return event.assigned_user_name?.toLowerCase() == user.username.toLowerCase();
  //     });
  //     setEvents(initialEvents);
  //     setUnfilteredEvents(initialEvents);
  //   } else if (user && user.role == 'Admin') {
  //     setUnfilteredEvents(events);
  //   }

  //   // setUnfilteredEvents(events);
  // }, []);

  // State to track the tick button status
  // const [isTickButtonGreen, setIsTickButtonGreen] = useState(false);

  // STATE TO PAGINATE THE MULTIPLE DATA
  const itemsPerPage = 5;
  const pageCount = Math.ceil(events.length / itemsPerPage);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const currentItems = events.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Function to handle tick button click
  // const handleTickButtonClick = () => {
  //   setIsTickButtonGreen(!isTickButtonGreen);
  //   console.log(isTickButtonGreen);
  // };


  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const eventStyleGetter = (event: Event) => {
    return {
      style: {
        backgroundColor: event.assigned_colour,
        color: 'white',
      },
    };
  };

  // const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
  //   toggleModal();
  // };

  // State to track the selected event
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  // console.log({selectedEvent});

  // Function to handle opening the modal for a specific event
  const handleEventsSelect = (event: any) => {
    setSelectedEvent(event)
    setIsOpen(true);
  };

  const handleNavigate = (date: Date) => {
    setCurrentMonth(moment(date).format('MMMM YYYY'));
    setCurrentDate(moment(date).format('YYYY-MM-DD'))
  };

  const switchToCalendarView = () => {
    setCurrentView('calendar');
  };

  const switchToListView = () => {
    setCurrentView('list');
  };

  React.useEffect(() => {
    if (!isOpen) {
      // Do something when the modal is closed
    }
  }, [isOpen]);

  const getViewEvents = (currentViewOverride: string = '') => {
    switch (currentViewOverride || currentView) {
      case "month": case "list": case "calendar":
        return events.filter((event: any) => {
          return moment(event.start_date).isBetween(
            moment().startOf("month").format("YYYY-MM-DD"),
            moment().endOf("month").format("YYYY-MM-DD")
          );
        })
        break;
      case "week":
        return events.filter((event: any) => {
          return moment(event.start_date).isBetween(
            moment().startOf("week").format("YYYY-MM-DD"),
            moment().endOf("week").format("YYYY-MM-DD")
          );
        })
        break;
      case "day":
        return events.filter((event: any) => {
          return moment(event.start_date).isBetween(
            moment().startOf("day").format("YYYY-MM-DD 00:00:00"),
            moment().endOf("day").format("YYYY-MM-DD 23:59:59")
          );
        })
      default:
        break;
    }
  }


  return (
    <div>
      {currentView === 'calendar' && (
        <Calendar
          localizer={localizer}
          events={unfilteredEvents}
          startAccessor="start_date"
          endAccessor="end_date"
          style={{ height: 600 }}
          popup
          eventPropGetter={eventStyleGetter}
          selectable={true}
          // onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventsSelect}
          views={['month', 'week', 'day']}
          onNavigate={handleNavigate}
          components={{
            toolbar: (toolbarProps: any) => (
              <CustomToolbar
                toolbar={toolbarProps}
                currentView={currentView}
                listView={listView}
                goToMonthView={() => {
                  toolbarProps.onView('month');
                  setListView('month');
                }}
                goToWeekView={() => {
                  toolbarProps.onView('week');
                  setListView('week');
                }}
                goToDayView={() => {
                  toolbarProps.onView('day');
                  setListView('day');
                }}
                switchToCalendarView={switchToCalendarView}
                switchToListView={switchToListView}
                showAllButton={false}
                showYearDate={true}
                taskStatus={taskStatus}
                handleTaskStatusChange={(e) => {
                  setTaskStatus(e.target.value);
                  switch (e.target.value) {
                    case 'done':
                      setUnfilteredEvents(getViewEvents().filter((event: any) => {
                        return Boolean(event.task_complete);
                      }));
                      break;
                    case 'active':
                      setUnfilteredEvents(getViewEvents().filter((event: any) => {
                        return !event.task_complete;
                      }))
                      break;
                    case 'overdue':
                      setUnfilteredEvents(getViewEvents().filter((event: any) => {
                        return event.status === 'overdue';
                      }))
                      break;
                    default:
                      break;
                  }
                }}
              />
            ),
          }}
        />
      )}
      {/* {events && events.map((item, index) => {
        return ( */}
      {selectedEvent && (
        <TeamIndex isOpen={isOpen} toggleModal={toggleModal} selectedEvent={selectedEvent} />
      )}
      {/* )
      })} */}

      {currentView === 'list' && (
        <section className='table-with-paginate'>
          <div className='list-view'>
            <CustomToolbar
              toolbar={{ label: currentMonth, onNavigate: () => { } }}
              currentView={currentView}
              listView={listView}
              // goToMonthView={switchToMonthView}
              goToMonthView={() => {
                let today = moment(currentDate);
                setEvents(unfilteredEvents.filter(event => {
                  return moment(event.start_date).isBetween(
                    today.startOf('month').format('YYYY-MM-DD'),
                    today.endOf('month').format('YYYY-MM-DD')
                  );
                }));
                console.log('clicked:month');
                setListView('month');
              }}
              goToWeekView={() => {
                let today = moment(currentDate);
                setEvents(unfilteredEvents.filter(event => {
                  return moment(event.start_date).isBetween(
                    today.startOf('week').format('YYYY-MM-DD'),
                    today.endOf('week').format('YYYY-MM-DD')
                  );
                }));
                console.log('clicked:week');
                setListView('week');
              }}
              goToDayView={() => {
                let today = moment(currentDate);
                setEvents(unfilteredEvents.filter(event => {
                  return moment(event.start_date).isSame(today);
                }));
                console.log('clicked:day');
                setListView('day');
              }}
              switchToCalendarView={switchToCalendarView}
              switchToListView={switchToListView}
              showAllButton={true}
              showYearDate={true}
              taskStatus={taskStatus}
              handleTaskStatusChange={(e) => {
                setTaskStatus(e.target.value);
                switch (e.target.value) {
                  case 'done':
                    setUnfilteredEvents(getViewEvents().filter((event: any) => {
                      return Boolean(event.task_complete);
                    }));
                    break;
                  case 'active':
                    setUnfilteredEvents(getViewEvents().filter((event: any) => {
                      return !event.task_complete;
                    }))
                    break;
                  case 'overdue':
                    setUnfilteredEvents(getViewEvents().filter((event: any) => {
                      return event.status === 'overdue';
                    }))
                    break;
                  default:
                    break;
                }
              }}
            />
            <Table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {unfilteredEvents && unfilteredEvents.map((item: any) => (
                  <tr key={item.id} onClick={() => handleEventsSelect(item)}>
                    <td>{item.title}</td>
                    <td>{moment(item.start_date).format('MMM D, YYYY')}</td>
                    {/* <td>{moment(item.end).format('MMM D, YYYY HH:MM')}</td> */}
                    <td>{moment(item.end_date).format('MMM D, YYYY hh:mm a')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {/* <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageChange}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          /> */}
        </section>
      )}
    </div>
  );
};

const mapStateToProps = () => ({

})

const mapDispatchToProps = {

}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(TeamCalIndex);
