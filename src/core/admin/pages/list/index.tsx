import React from 'react';
import List from './List';
import GeneralModal from '../../../../components/UI/GeneralModal';
import Button from '../../../../components/UI/Forms/Buttons';
import ModalForm from './ModalForm';

const ManageFormList = () => {

  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen)

  return (
    <div className='modals'>
      <div className="modals-form p-3">
        <GeneralModal open={isOpen} toggle={toggle} title='Register Here'>
          <ModalForm />
        </GeneralModal>
      </div>

      <div className="cash-content">
        <div className="text-right">
          <Button
            className="btn custom-btn mt-2"
            text={'Form Modal'}
            type="submit"
            onClick={() => {
              toggle();
            }}
          />
        </div>
        <List />
      </div>
    </div>
  )
}

export default ManageFormList;