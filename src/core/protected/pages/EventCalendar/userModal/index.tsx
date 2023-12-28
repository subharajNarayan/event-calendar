import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { ConnectedProps, connect } from 'react-redux';
import Form from './Form';
import { RootState } from '../../../../../store/root-reducer';
import { updateTaskLogsAction } from '../../../../../store/modules/Tasks/updateTaskLogs';
import { useFormik } from 'formik';
import toast from '../../../../../components/Notifier/Notifier';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { DeleteIcon, EditIconDark } from '../../../../../assets/images/xd';
import moment from 'moment';
interface Props extends PropsFromRedux {
  isOpen: boolean;
  toggleModal: () => void;
  selectedEvent: any;
}

const validationSchema = Yup.object({});

const TeamIndex = (props: Props) => {
  const [initialData, setInitialData] = useState({
    task_complete: 'false',
  });

  const [isTaskComplete, setIsTaskComplete] = useState<boolean>(false);

  useEffect(() => {
    setIsTaskComplete(initialData.task_complete === 'true');
  }, [initialData.task_complete]);

  const handleTickButtonClick = async () => {
    const res = await props.updateTaskLogsAction(props.selectedEvent.id, {
      ...props.selectedEvent,
      task_complete: (!isTaskComplete).toString(),
    });

    if (res.status === 200) {
      setInitialData({ task_complete: (!isTaskComplete).toString() });
      toast.success('Task updated successfully...!');
    } else {
      toast.error('Oops...Something is Wrong!');
    }
  };

  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useFormik({
    initialValues: initialData,
    validationSchema: validationSchema,
    onSubmit: async (submitValue, { resetForm }) => {
      // Your existing code for submitting the form
    },
  });

  return (
    <div>
      <Modal isOpen={props.isOpen} toggle={props.toggleModal}>
        <ModalHeader toggle={props.toggleModal}>
          {props.selectedEvent ? props.selectedEvent.title : ''}
          <div className="right-side-btn " style={{position:"absolute", right:"47px", top:"14px"}}>
            <div className="action d-flex align-item-center">
              <div role='button' className="mr-0" 
              >
                <img src={EditIconDark} alt="edit" width="15px" className='mx-2' />
              </div>
              <div role='button' className="mr-0">
                <img src={DeleteIcon} alt="delete" width="15px" className='mx-2' />
              </div>
            <button className="tick-button ml-2" onClick={handleTickButtonClick} style={{right: "68px"}}>
              {isTaskComplete ? <div className='tick-true'>
                <FontAwesomeIcon icon={faCheck} />
              </div> : <div className='tick-false'>
                <FontAwesomeIcon icon={faCheck} />
              </div>}
            </button>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="event-body">
            <div className="description">
              <p style={{ fontSize: '12px' }}>{moment(props.selectedEvent.start_date).format('DD MMM YYYY hh:mm A')}</p>
              <text>{props.selectedEvent.description}</text>
            </div>
            <hr />
            <div className="date-time">
              <p className='d-flex align-items-center '>Assignee: {props.selectedEvent.assigned_user_name}</p>
            </div>
            <Form selectedEvent={props.selectedEvent} toggleModal={props.toggleModal} />
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.taskData.updateTaskLogs.isFetching,
});

const mapDispatchToProps = {
  updateTaskLogsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TeamIndex);
