import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Form from './Form';


interface Props  {
  isOpen: boolean;
  toggleModal: () => void;
}

const TeamIndex = (props: Props) => {

  const { isOpen, toggleModal} = props;

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add Team Members</ModalHeader>
        <ModalBody>
          <Form />
        </ModalBody>
        {/* <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter> */}
      </Modal>

    </div>
  )
}

export default TeamIndex