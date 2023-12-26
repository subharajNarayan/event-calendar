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
  currentView: 'calendar' | 'list' | 'month' | 'week' | 'day' | 'listweek' | 'listday';
  goToMonthView: () => void;
  goToWeekView: () => void;
  goToDayView: () => void;
  switchToCalendarView: () => void;
  switchToListView: () => void;
  showAllButton: boolean;
  showYearDate: boolean;
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
              <select name="" id="" className='form-control mx-2'>
                <option value="">All</option>
                <option value="">Done</option>
                <option value="">OverDue</option>
                <option value="">Active</option>
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

const listView = ['list', 'listweek', 'listday'];

// interface Props extends PropsFromRedux {

// }

const TeamCalIndex = (props: CalendarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<string>(moment().format('MMMM YYYY'));
  const [currentDate, setCurrentDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [currentView, setCurrentView] = useState<'calendar' | 'list' | 'month' | 'week' | 'day' | 'listweek' | 'listday'>('calendar');
  // const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [unfilteredEvents, setUnfilteredEvents] = useState<Event[]>([]);

  const { isAuthenticated, getAuthUser } = useAuthentication();
  const user = getAuthUser();
  // Initialize events with some default data
  // const [events, setEvents] = useState<Event[]>([
  //   {
  //     id: 1,
  //     title: 'Default Event 1',
  //     start: "2023-12-23T04:47", // Use the current date as the start date
  //     end: "2023-12-23T04:47", // Use the current date as the end date
  //     description: 'This is a default event',
  //     assigned_user_name: "Subharaj",
  //     assigned_colour: "#4285f4",
  //     status: "active",
  //     task_complete: false,
  //   },
  //   {
  //     id: 2,
  //     title: 'Default Event 2',
  //     start: "2023-12-26T02:20", // Use the current date as the start date
  //     end: "2023-12-27T04:47", // Use the current date as the end date
  //     description: 'This is a default event',
  //     assigned_user_name: "test",
  //     assigned_colour: "#ff0000",
  //     status: "active",
  //     task_complete: false
  //   },
  //   {
  //     id: 3,
  //     title: 'Default Event 3',
  //     start: "2023-12-24T02:00", // Use the current date as the start date
  //     end: "2023-12-24T04:59", // Use the current date as the end date
  //     description: 'This is a default event',
  //     assigned_user_name: "Srijan Duwal",
  //     assigned_colour: "#0ff000",
  //     status: "active",
  //     task_complete: false
  //   },
  //   // Add more default events as needed
  // ]);

  const [events, setEvents] = useState<any>([]);
  console.log({events});

  //    // Not using anywhere but it just to view/Fetch data
  React.useEffect(() => {
    // Fetch data using Axios when the component mounts
    axios.get('https://kyush.pythonanywhere.com/accounts/api/tasks/') // Replace with API endpoint
      .then((response) => {
        let initialEvents = response.data.map((event: any) => ({ ...event, start: event.start_date, end: event.end_date }));
        // setEvents(initialEvents);
        // setUnfilteredEvents(initialEvents);

        if (user && user.role == 'Team_Member') {
          initialEvents = initialEvents.filter((event: any) => {
            // console.log(event.assigned_user_name, user.username);

            return event.assigned_user_name?.toLowerCase() == user.username.toLowerCase();
          });
          setEvents(initialEvents);
          setUnfilteredEvents(initialEvents);
        } else if (user && user.role == 'Admin') {
          setUnfilteredEvents(initialEvents);
        }


      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // React.useEffect(() => {
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
  const [isTickButtonGreen, setIsTickButtonGreen] = useState(false);

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
  const handleTickButtonClick = () => {
    setIsTickButtonGreen(!isTickButtonGreen);
    console.log(isTickButtonGreen);
  };


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
console.log({selectedEvent});

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

  // const switchToMonthView =() => {
  //   setCurrentView('month')
  // }

  return (
    <div>
      {currentView === 'calendar' && (
        <Calendar
          localizer={localizer}
          events={events}
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
                goToMonthView={() => toolbarProps.onView('month')}
                goToWeekView={() => toolbarProps.onView('week')}
                goToDayView={() => toolbarProps.onView('day')}
                switchToCalendarView={switchToCalendarView}
                switchToListView={switchToListView}
                showAllButton={false}
                showYearDate={true}
              />
            ),
          }}
        />
      )}
      {/* {events && events.map((item, index) => {
        return ( */}
      {selectedEvent && (
        <TeamIndex isOpen={isOpen} toggleModal={toggleModal} selectedEvent={selectedEvent} />
        // <Modal isOpen={isOpen} toggle={toggleModal}>
        //   <ModalHeader toggle={toggleModal}>
        //     {selectedEvent.title}
        //     <button
        //       className={`tick-button ${isTickButtonGreen ? 'green' : 'red'}`}
        //       onClick={handleTickButtonClick}
        //     >
        //       ✔
        //     </button>
        //   </ModalHeader>
        //   <ModalBody>
        //     <div className="event-body">
        //       <div className="description">
        //         <p style={{ fontSize: "12px" }}>{selectedEvent.start_date}</p>
        //         <text>{selectedEvent.description}</text>
        //       </div>
        //       <hr />
        //       <div className="date-time">
        //         <p>{selectedEvent.assigned_user_name}</p>
        //       </div>
        //       <Form />
        //     </div>
        //   </ModalBody>
        // </Modal>
      )}
      {/* )
      })} */}

      {listView.indexOf(currentView) !== -1 && (
        <section className='table-with-paginate'>
          <div className='list-view'>
            <CustomToolbar
              toolbar={{ label: currentMonth, onNavigate: () => { } }}
              currentView={currentView === 'calendar' ? 'calendar' : 'list'}
              // goToMonthView={switchToMonthView}
              goToMonthView={() => {
                let today = moment(currentDate);
                setEvents(unfilteredEvents.filter(event => {
                  return moment(event.start_date).isBetween(
                    today.startOf('month').format('YYYY-MM-DD'), today.endOf('month').format('YYYY-MM-DD')
                  );
                }));
                console.log('clicked:month');
                setCurrentView('list');
              }}
              goToWeekView={() => {
                let today = moment(currentDate);
                setEvents(unfilteredEvents.filter(event => {
                  return moment(event.start_date).isBetween(
                    today.startOf('week').format('YYYY-MM-DD'), today.endOf('week').format('YYYY-MM-DD')
                  );
                }));
                console.log('clicked:week');

                setCurrentView('listweek');
              }}
              goToDayView={() => {
                let today = moment(currentDate);
                setEvents(unfilteredEvents.filter(event => {
                  return moment(event.start_date).isSame(today);
                }));
                console.log('clicked:day');
                setCurrentView('listday');
              }}
              switchToCalendarView={switchToCalendarView}
              switchToListView={switchToListView}
              showAllButton={true}
              showYearDate={true}
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
                {events && events.map((item:any) => (
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
