import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import Form from './Form';


interface Props  {
  isOpen: boolean;
  toggleModal: () => void;
  TeamData: any;
  success: () => void;
}

const TeamIndex = (props: Props) => {

  const { isOpen, toggleModal, TeamData} = props;

  const [editData, setEditData] = React.useState<any>(TeamData)

  React.useEffect(() => {
    setEditData(TeamData);
  }, [TeamData]);
  console.log({editData})
  

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add Team Members</ModalHeader>
        <ModalBody>
          <Form toggleModal={toggleModal} editData={editData} success={props.success}/>
        </ModalBody>
      </Modal>

    </div>
  )
}

export default TeamIndex