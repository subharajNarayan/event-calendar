import React from 'react'
import MyCalendar from '../EventCalendar/MyCalendar';

const Home = () => {
  return (
    <div className="main-content">
        <div className="main-content-home">
          <div className="body-calendar">
            <MyCalendar events={[]} />
          </div>
        </div>
      </div>
  )
}

export default Home