import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import Form from './Form';


interface Props {
  isOpen: boolean;
  toggleModal: () => void;
  data?: any;
  success: () => void;
}

const UserEditIndex = (props: Props) => {

  const { isOpen, toggleModal, data } = props;

  const [editData, setEditData] = React.useState<any>(data)

  console.log({ editData });

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add Task</ModalHeader>
        <ModalBody>
          <Form editData={editData} toggleModal={toggleModal} success={props.success}/>
        </ModalBody>
      </Modal>

    </div>
  )
}

export default UserEditIndex;