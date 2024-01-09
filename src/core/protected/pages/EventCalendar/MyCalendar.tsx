import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Table } from 'reactstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faList } from '@fortawesome/free-solid-svg-icons';
import TeamIndex from './userModal';
import useAuthentication from '../../../../services/authentication/AuthService';
import { ConnectedProps, connect } from 'react-redux';
import axios from 'axios';

const localizer = momentLocalizer(moment);

interface Event {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  description: string;
  assigned_user_name: string;
  assigned_user_colour: string;
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

  const [events, setEvents] = useState<Event[]>([]);
  const [fetchTasks, setFetchTasks] = React.useState<number>(0);

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); //For sorting AssigneTo column

  const handleSortChange = (e: any) => {
    setSortDirection(e.target.value as 'asc' | 'desc');
  };
  //    // Not using anywhere but it just to view/Fetch data
  React.useEffect(() => {
    // Fetch data using Axios when the component mounts
    axios.get('https://event.finliftconsulting.com.np/accounts/api/tasks/') // Replace with API endpoint
      .then((response) => {
        let initialEvents = response.data.map((event: any) => ({
          ...event,
          start_date: moment(event.start_date).toDate(),
          end_date: moment(event.end_date).toDate()
          // start_date: moment.utc(event.start_date).format('YYYY-MM-DD HH:mm:ss'),
          // end_date: moment.utc(event.end_date).format('YYYY-MM-DD HH:mm:ss'),

        }));

        initialEvents = initialEvents.filter((event: any) => {
          // console.log(event.assigned_user_name, user.username);
          return event.assigned_user_name?.toLowerCase() == user.username.toLowerCase();
        });
        console.log(initialEvents, "DATA INITIAL");


        setEvents(initialEvents);
        setUnfilteredEvents(initialEvents);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [fetchTasks]);

  const handleTasksAdd = () => {
    setFetchTasks(fetchTasks + 1);
  };

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
        backgroundColor: event.assigned_user_colour,
        color: 'white',
      },
    };
  };

  console.log({ eventStyleGetter });
  
  // const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
  //   toggleModal();
  // };

  // State to track the selected event
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  console.log({ events });

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
    setListView('month');
  };

  const switchToListView = () => {
    setCurrentView('list');
    setListView('month');
  };

  React.useEffect(() => {
    if (!isOpen) {
      // Do something when the modal is closed
    }
  }, [isOpen]);


  React.useEffect(() => {
    let eventlist: Event[] = [];
    if (currentView == 'calendar') {
      eventlist = getViewEvents();
    }
    if (currentView == 'list') {
      eventlist = getViewEvents(listView);
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
  }, [currentMonth, taskStatus, listView, currentView]);

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
                }}
              />
            ),
          }}
        />
      )}
      {selectedEvent && (
        <TeamIndex isOpen={isOpen} toggleModal={toggleModal} selectedEvent={selectedEvent} success={handleTasksAdd} />
      )}

      {currentView === 'list' && (
        <section className='table-with-paginate'>
          <div className='list-view'>
            <CustomToolbar
              toolbar={{ label: currentMonth, onNavigate: () => { } }}
              currentView={currentView}
              listView={listView}
              // goToMonthView={switchToMonthView}
              goToMonthView={() => {
                setListView('month');
              }}
              goToWeekView={() => {
                setListView('week');
              }}
              goToDayView={() => {
                setListView('day');
              }}
              switchToCalendarView={switchToCalendarView}
              switchToListView={switchToListView}
              showAllButton={false}
              showYearDate={false}
              taskStatus={taskStatus}
              handleTaskStatusChange={(e) => {
                setTaskStatus(e.target.value);
              }}
            />
            <Table className='list-table'>
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
                </tr>
              </thead>
              {/* <tbody>
              {unfilteredEvents
                .sort((a, b) => {
                  const sortFactor = sortDirection === 'asc' ? 1 : -1;
                  const assignedToA = a.assigned_user_name?.toLowerCase() || '';
                  const assignedToB = b.assigned_user_name?.toLowerCase() || '';
                  return assignedToA.localeCompare(assignedToB) * sortFactor;
                })
                .map((item: any) => (
                  <tr key={item.id} onClick={() => handleEventsSelect(item)}>
                    <td>{item.title}</td>
                    <td>{moment(item.start_date).format('MMM D, YYYY')}</td>
                    <td>{moment(item.end_date).format('MMM D, YYYY hh:mm a')}</td>
                    <td>{item.assigned_user_name}</td>
                  </tr>
                ))}
            </tbody> */}
              <tbody>
                {unfilteredEvents && unfilteredEvents.map((item: any) => (
                  <tr key={item.id} onClick={() => handleEventsSelect(item)}>
                    <td>{item.title}</td>
                    <td>{moment(item.start_date).format('MMM D, YYYY')}</td>
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
