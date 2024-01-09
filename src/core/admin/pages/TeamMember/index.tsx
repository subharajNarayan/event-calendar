import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import Form from './Form';


interface Props  {
  isOpen: boolean;
  toggleModal: () => void;
  TeamDatas: any;
  success: () => void;
}

const TeamIndex = (props: Props) => {

  const { isOpen, toggleModal, TeamDatas} = props;

  const [editData, setEditData] = React.useState<any>(TeamDatas)

  React.useEffect(() => {
    setEditData(TeamDatas);
  }, [TeamDatas]);
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