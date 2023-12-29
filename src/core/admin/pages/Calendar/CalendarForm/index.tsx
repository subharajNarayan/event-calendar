import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import Form from './Form';
import CIndex from '..';


interface Props {
  isOpen: boolean;
  toggleModal: () => void;
  data?: any;
}

const CalendarIndex = (props: Props) => {

  const { isOpen, toggleModal, data } = props;

  const [editData, setEditData] = React.useState<any>(data)

  console.log({ editData });

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add Task</ModalHeader>
        <ModalBody>
          <Form editData={editData} toggleModal={toggleModal}/>
        </ModalBody>
      </Modal>

    </div>
  )
}

export default CalendarIndex;