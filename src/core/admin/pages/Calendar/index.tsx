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
  assigned_user_colour: string;
}


interface DBEvent {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  description: string;
  assigned_user_name: string;
  // assigned_colour:string;
  assigned_user_colour: string;
}


interface CalendarProps {
  events: Event[];
  allEvents: Event[];
}

const CustomToolbar: React.FC<{
  toolbar: any;
  currentView:'month' | 'week' | 'day';
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
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('calendar');
  // const [currentView, setCurrentView] = useState<'calendar' | 'list' | 'month' | 'week' | 'day'>('calendar');
  const [currentDate, setCurrentDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [unfilteredEvents, setUnfilteredEvents] = useState<Event[]>([]);
  const [listCurrentView, setListCurrentView] = useState<'month' | 'week' | 'day'>('month');

  React.useEffect(() => {
    setUnfilteredEvents(events);
  }, [events.length]);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

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

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedDate(slotInfo.start);
    const event : DBEvent = {
      start_date: moment(slotInfo.start).format('YYYY-MM-DD HH:mm:ss'),
      id: 0,
      title: '',
      description: '',
      // end_date: '',
      end_date: moment(slotInfo.start).format('YYYY-MM-DD HH:mm:ss'),
      assigned_user_name: '',
      assigned_user_colour: '',
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
    console.log('clicked');
    
    setCurrentView('list');
  };

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedDate(null);
      setSelectedEvent(null);
    }
  }, [isOpen]);

  const getViewEvents = (currentViewOverride:string = '') => {
    switch (currentViewOverride || currentView) {
      case 'month': case 'list': case 'calendar': {
        return events.filter(event => {
              return moment(event.start_date).isBetween(
                moment().startOf('month').format('YYYY-MM-DD'), 
                moment().endOf('month').format('YYYY-MM-DD')
              );
            });
      }
      case 'week': {
        return events.filter(event => {
          return moment(event.start_date).isBetween(
            moment().startOf('week').format('YYYY-MM-DD'), 
            moment().endOf('week').format('YYYY-MM-DD')
          );
        })
      }
      case 'day': {
        return events.filter(event => {
          return moment(event.start_date).isBetween(
            moment().startOf('day').format('YYYY-MM-DD 00:00:00'), 
            moment().endOf('day').format('YYYY-MM-DD 23:59:59')
          );
        })
      }
      default: {
        return events
      }
    }
  }

  const [taskStatus, setTaskStatus] = React.useState<string>('');

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
          onSelectEvent={handleSelectEvent}
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
                    switch(e.target.value) {
                      case 'done': {
                        setUnfilteredEvents(getViewEvents().filter((event: any) => {
                          return Boolean(event.task_complete);
                        }))
                        break;
                      }
                      case 'overdue': {
                        setUnfilteredEvents(getViewEvents().filter((event: any) => {
                          return event.status === 'overdue';
                        }))
                        break;
                      }
                      case 'active': {
                        setUnfilteredEvents(getViewEvents().filter((event: any) => {
                          return event.status === 'active';
                        }))
                        break;
                      }
                      default: {
                        setUnfilteredEvents(getViewEvents());
                      }
                    }
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
            setUnfilteredEvents(getViewEvents('month'));
            setListCurrentView('month');
          }}
          goToWeekView={() => {
            setUnfilteredEvents(getViewEvents('week'));
            setListCurrentView('week');
          }}
          goToDayView={() => {
            setUnfilteredEvents(getViewEvents('day'));
            setListCurrentView('day');
          }}
          taskStatus={taskStatus}
          handleTaskStatusChange={(e) => {
            setTaskStatus(e.target.value);
            switch(e.target.value) {
              case 'done': {
                setUnfilteredEvents(getViewEvents().filter((event: any) => {
                  return Boolean(event.task_complete);
                }))
                break;
              }
              case 'overdue': {
                setUnfilteredEvents(getViewEvents().filter((event: any) => {
                  return event.status === 'overdue';
                }))
                break;
              }
              case 'active': {
                setUnfilteredEvents(getViewEvents().filter((event: any) => {
                  return event.status === 'active';
                }))
                break;
              }
              default: {
                setUnfilteredEvents(getViewEvents());
              }
            }
            
          }}
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
              {(unfilteredEvents)?.map((item, index) => (
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
