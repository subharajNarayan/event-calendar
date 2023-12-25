import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CalendarIndex from './CalendarForm';
import { Table } from 'reactstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faList } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const localizer = momentLocalizer(moment);

interface Event {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  description: string; // Include this line
  assigned_user_name: string;
  // assigned_colour: string;
  color: string;
}


interface DBEvent {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  description: string;
  assigned_user_name: string;
  // assigned_colour:string;
  color: string;
}


interface CalendarProps {
  events: Event[];
  allEvents: Event[];
}

const CustomToolbar: React.FC<{
  toolbar: any;
  currentView: 'calendar' | 'list' | 'month' | 'week' | 'day';
  goToMonthView: () => void;
  goToWeekView: () => void;
  goToDayView: () => void;
  switchToCalendarView: () => void;
  switchToListView: () => void;
  showAllButton: boolean;
  showYearDate: boolean;
  toggleForm: () => void;
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
  toggleForm,
}) => {
    return (
      <div className='calendar-view'>
        <div className='toolbar-heading d-flex'>
          <div className="toolbar-heading-top">
            <h4>Task Calendar</h4>
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
        {showAllButton && (
          <div className="list-view d-flex justify-content-end align-items-baseline">
            <div className="toolbar-all px-3">
              <p>All</p>
            </div>
            <div className="toolbar-add text-right">
              <button onClick={toggleForm}> + </button> Task
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


const CIndex: React.FC<CalendarProps> = ({ events, allEvents }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<DBEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<string>(moment().format('MMMM YYYY'));
  const [currentView, setCurrentView] = useState<'calendar' | 'list' | 'month' | 'week' | 'day' | 'listweek' | 'listday'>('calendar');
  // const [currentView, setCurrentView] = useState<'calendar' | 'list' | 'month' | 'week' | 'day'>('calendar');
  const [currentDate, setCurrentDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [unfilteredEvents, setUnfilteredEvents] = useState<Event[]>([]);


  React.useEffect(() => {
    setUnfilteredEvents(events);
  }, []);


  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const eventStyleGetter = (event: Event) => {
    return {
      style: {
        backgroundColor: event.color,
        color: 'white',
      },
    };
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedDate(slotInfo.start);
    setSelectedEvent(null);
    toggleModal();
  };


  // In CalendarIndex.tsx
// const [users, setUsers] = useState([]);
const [eventss, setEvents] = useState([]);
// const [unfilteredEvents, setUnfilteredEvents] = useState([]);

React.useEffect(() => {
  // Fetch events using Axios when the component mounts
  axios.get('http://localhost:5000/api/events') // Replace with API endpoint for events
    .then((response) => {
      // Update the events state with the fetched data
      setEvents(response.data);
      setUnfilteredEvents(response.data);
    })
    .catch((error) => {
      console.error('Error fetching events:', error);
    });
}, []);



  const handleSelectEvent = (event: Event) => {
    let dbEvent: DBEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      start_date: moment(event.start_date).format('YYYY-MM-DD HH:mm:ss'),
      end_date: event.end_date ? moment(event.end_date).format('YYYY-MM-DD HH:mm:ss') : '',
      assigned_user_name: event.assigned_user_name,
      color: event.color,
      // assigned_colour: event.assigned_colour
    }
    setSelectedEvent(dbEvent);
    setSelectedDate(null);
    console.log({ event });
    toggleModal();
  };

  const handleNavigate = (date: Date) => {
    setCurrentMonth(moment(date).format('MMMM YYYY'));
  };

  const switchToCalendarView = () => {
    setCurrentView('calendar');
  };

  const switchToListView = () => {
    setCurrentView('list');
  };

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedDate(null);
      setSelectedEvent(null);
    }
  }, [isOpen]);

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
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
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
                toggleForm={toggleForm}
              />
            ),
          }}
        />
      )}

      {currentView === 'list' && (
        <div>
          <CustomToolbar
          toolbar={{ label: currentMonth, onNavigate: () => {} }}
          currentView={currentView}
          goToMonthView={() => {}}
          goToWeekView={() => {}}
          goToDayView={() => {}}

          // goToMonthView={() => {
          //   let today = moment(currentDate);
          //   events(unfilteredEvents.filter(event => {
          //     return moment(event.start).isBetween(
          //       today.startOf('month').format('YYYY-MM-DD'), today.endOf('month').format('YYYY-MM-DD')
          //     );
          //   }));
          //   console.log('clicked:month');
          //   setCurrentView('list');
          // }}
          // goToWeekView={() => {
          //   let today = moment(currentDate);
          //   setEvents(unfilteredEvents.filter(event => {
          //     return moment(event.start).isBetween(
          //       today.startOf('week').format('YYYY-MM-DD'), today.endOf('week').format('YYYY-MM-DD')
          //     );
          //   }));
          //   console.log('clicked:week');

          //   setCurrentView('listweek');
          // }}
          // goToDayView={() => {
          //   let today = moment(currentDate);
          //   setEvents(unfilteredEvents.filter(event => {
          //     return moment(event.start).isSame(today);
          //   }));
          //   console.log('clicked:day');
          //   setCurrentView('listday');
          // }}
          switchToCalendarView={switchToCalendarView}
          switchToListView={switchToListView}
          showAllButton={true}
          showYearDate={false}
          toggleForm={toggleForm}
        />
          <Table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Assigned To</th>
                {/* <th></th> */}
              </tr>
            </thead>
            <tbody>
              {(events.length != 0 ? events : allEvents).map((item, index) => (
                <tr key={index} onClick={() => handleSelectEvent(item)}>
                  <td>{item.title}</td>
                  <td>{moment(item.start_date).format('MMM D, YYYY')}</td>
                  <td>{moment(item.end_date).format('MMM D, YYYY')}</td>
                  <td>{item.assigned_user_name} </td>
                  {/* <td><span style={{ backgroundColor: item.assigned_colour, padding: "0.6rem",display: "inline-block", position: "relative", borderRadius: "50%" }}></span></td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {selectedDate && <CalendarIndex isOpen={isOpen} toggleModal={toggleModal} />}
      {selectedEvent && <CalendarIndex isOpen={isOpen} data={selectedEvent} toggleModal={toggleModal} />}
      {isFormOpen && <CalendarIndex isOpen={true} toggleModal={toggleForm} />}
    </div>
  );
};

export default CIndex;
