import React from 'react'
import MyCalendar from '../EventCalendar/MyCalendar';
// import MyCalendar from '../EventCalendar/testCalendar';
const Home = () => {
  return (
    <div className="main-content">
        <div className="main-content-home">
          <div className="body-calendar">
            <MyCalendar events={[]} />
            {/* <MyCalendar /> */}
          </div>
        </div>
      </div>
  )
}

export default Home