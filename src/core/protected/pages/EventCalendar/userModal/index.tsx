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
import { EditIconDark } from '../../../../../assets/images/xd';
import moment from 'moment';
import UserEditIndex from '../userEditModal';
interface Props extends PropsFromRedux {
  isOpen: boolean;
  toggleModal: () => void;
  selectedEvent: any;
  success: () => void;
  setTaskStatus: (value: string) => void;
}

const validationSchema = Yup.object({});

const TeamIndex = (props: Props) => {  

  const [initialData, setInitialData] = useState({
    task_complete: props.selectedEvent.task_complete.toString(),
  });

  const [isTaskComplete, setIsTaskComplete] = useState<boolean>(props.selectedEvent?.task_complete! ?? false);

  console.log(isTaskComplete, "isTaskComplete");
  
  // useEffect(() => {
  //   setIsTaskComplete(initialData.task_complete === 'true');
  // }, [initialData.task_complete]);

  React.useEffect(() => {
    if (props.selectedEvent) {
      const taskComplete = props.selectedEvent.task_complete;
      const initialIsTaskComplete = taskComplete;
      setIsTaskComplete(initialIsTaskComplete);
    }
  }, [props.selectedEvent]);

  const handleTickButtonClick = async () => {
    const res = await props.updateTaskLogsAction(props.selectedEvent.id, {
      ...props.selectedEvent,
      // task_complete: (!isTaskComplete).toString(),
      task_complete: !props.selectedEvent.task_complete,
      start_date: moment(props.selectedEvent.start_date).format('YYYY-MM-DD HH:mm:ss'),
      end_date: moment(props.selectedEvent.end_date).format('YYYY-MM-DD HH:mm:ss'),
    });
    if (res.status === 200) {
      // setInitialData({ task_complete: (!isTaskComplete).toString() });
      setIsTaskComplete(!isTaskComplete);
      toast.success('Task status updated successfully...!');
      props.success();
      // Update the taskStatus state to an empty string
      props.setTaskStatus('');
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
    },
  });

  const handleSelectEvent = (event: any) => {
    console.log("checked");
    setRenderUserEditIndex(true);
    props.toggleModal();
    props.success();
  }

  const [renderUserEditIndex, setRenderUserEditIndex] = useState(false);

  return (
    <div>
      <Modal isOpen={props.isOpen} toggle={props.toggleModal}>
        <ModalHeader toggle={props.toggleModal}>
          {props.selectedEvent ? props.selectedEvent.title : ''}
          <div className="right-side-btn " style={{ position: "absolute", right: "47px", top: "14px" }}>
            <div className="action d-flex align-item-center">
              <div role='button' className="mr-0" onClick={() => handleSelectEvent(props.selectedEvent)}>

                <img src={EditIconDark} alt="edit" width="15px" className='mx-2' />
              </div>
              <button className="tick-button ml-2" onClick={handleTickButtonClick} style={{ right: "35px" }}>
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
                <p style={{ fontSize: '12px', marginBottom: '0.5rem' }}>
                  {moment(props.selectedEvent.start_date).format('DD MMM YYYY hh:mm A')}
                  <strong style={{ fontSize: '14px' }}> TO </strong>
                  {moment(props.selectedEvent.end_date).format('DD MMM YYYY hh:mm A')}
                </p>
              <text>{props.selectedEvent.description}</text>
            </div>
            <hr />
            <div className="date-time">
              <p className='d-flex align-items-center '>Assignee: {props.selectedEvent.assignee}</p>
            </div>
            <Form selectedEvent={props.selectedEvent} toggleModal={props.toggleModal} />
          </div>
        </ModalBody>
      </Modal>
      {renderUserEditIndex && (
        <UserEditIndex
          isOpen={true} // Assuming UserEditIndex takes an isOpen prop
          toggleModal={() => setRenderUserEditIndex(false)} // Close the UserEditIndex modal
          data={props.selectedEvent}
          success={props.success}
        />
      )}
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
