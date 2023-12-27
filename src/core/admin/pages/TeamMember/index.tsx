import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Form from './Form';


interface Props  {
  isOpen: boolean;
  toggleModal: () => void;
  TeamData: any;
}

const TeamIndex = (props: Props) => {

  const { isOpen, toggleModal, TeamData} = props;

  const [editData, setEditData] = React.useState<any>(TeamData)

  // console.log({ editData });

  React.useEffect(() => {
    setEditData(TeamData);
  }, [TeamData]);
  

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add Team Members</ModalHeader>
        <ModalBody>
          <Form toggleModal={toggleModal} editData={editData}/>
        </ModalBody>
      </Modal>

    </div>
  )
}

export default TeamIndex