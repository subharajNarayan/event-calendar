import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Form from './Form';


interface Props {
  isOpen: boolean;
  toggleModal: () => void;
  events: any
}

const TeamIndex = (props: Props) => {

  const [initialData, setInitialData] = React.useState({
    status: true,
  });

  const { isOpen, toggleModal, events } = props;
  console.log(props.events, "SS");


  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Event Task 1 <button
          className="tick-button"
               >
          ✔
        </button></ModalHeader>
        <ModalBody>
          <Form/>
        </ModalBody>
      </Modal>

    </div>
  )
}

export default TeamIndex