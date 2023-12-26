import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Form from './Form';


interface Props {
  isOpen: boolean;
  toggleModal: () => void;
  selectedEvent: any;
}

const TeamIndex = (props: Props) => {

  const [initialData, setInitialData] = React.useState({
    status: true,
  });

  // const { isOpen, toggleModal, selectedEvent } = props;
  console.log(props.selectedEvent, "SS");
  return (
    <div>
      <Modal isOpen={props.isOpen} toggle={props.toggleModal}>
        <ModalHeader toggle={props.toggleModal}>
          {props.selectedEvent ? props.selectedEvent.title : ""}
          <button
            className="tick-button"
          >
            ✔
          </button>
        </ModalHeader>
        <ModalBody>
          <div className="event-body">
            <div className="description">
              <p style={{ fontSize: "12px" }}>{props.selectedEvent.start_date}</p>
              <text>{props.selectedEvent.description}</text>
            </div>
            <hr />
            <div className="date-time">
              <p>{props.selectedEvent.assigned_user_name}</p>
            </div>
            <Form selectedEvent={props.selectedEvent}/>
          </div>
        </ModalBody>
      </Modal>

    </div>
  )
}

export default TeamIndex;