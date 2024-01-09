import React, { useState } from 'react';
import { ConnectedProps, connect, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
// import { taskInitialValues, taskValidationSchema } from './schema';
import { useFormik } from 'formik';
import { getTeamMemberLogsAction } from '../../../../../store/modules/TeamMember/getTeamMemberLogs';
import { postTaskLogsAction } from '../../../../../store/modules/Tasks/postTaskLogs';
import { updateTaskLogsAction } from '../../../../../store/modules/Tasks/updateTaskLogs';
import toast from '../../../../../components/Notifier/Notifier';
import Button from '../../../../../components/UI/Forms/Buttons';
import { RootState } from '../../../../../store/root-reducer';
import moment from 'moment';
import TokenService from '../../../../../services/jwt-token/jwt-token';
import * as Yup from 'yup';
import { getMemberLogsAction } from '../../../../../store/modules/TeamMember/getMemberLogs';


export const taskValidationSchema = Yup.object().shape({

})
interface Props extends PropsFromRedux {
  editData: any,
  toggleModal: () => void;
  success: () => void;
}

const UserEditForm = (props: Props) => {

  const [initialData, setInitialData] = useState({
    ...(props.editData || {})
  });

  console.log(props.editData, "Task ADD")

  const TeamDetails = useSelector((state: RootState) => state.teamMemberData.getMemberLogs.data);

  console.log(TeamDetails, "TeamDetails");
  
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (props.editData) {
      setInitialData({
        ...props.editData,
        start_date: moment.utc(props.editData.start_date).format('YYYY-MM-DD HH:mm'),
        end_date: moment.utc(props.editData.end_date).format('YYYY-MM-DD HH:mm'),
      })
    }
    dispatch(getMemberLogsAction())
  }, [props.editData]);


  const [isLoader, setLoader] = React.useState(false);

  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema: taskValidationSchema,
    onSubmit: async (submitValue, { resetForm }) => {

      let start_date = submitValue.start_date;
      let end_date = submitValue.end_date;

      if (moment(end_date).isBefore(start_date)) {
        toast.error("End date should be greater than start date")
        return
      }

      let res;
      setLoader(true);

      const userDetails = TokenService.getAccessToken();

      const updatedSubmitValue = {
        ...submitValue,
        username: userDetails.username,
        // Add other user details if needed
      };

      // if (props.editData && props.editData.id) {
      res = await props.updateTaskLogsAction(props.editData.id, updatedSubmitValue)
      // } 

      if (res.status === 201 || res.status === 200) {
        if (props.editData) {
          setInitialData({
            ...submitValue
          })
          toast.success("Data Updated Successful...!")
          resetForm()
          setLoader(false);
          props.success();
          props.toggleModal();
        }
      } else {
        toast.error("SERVER ERROR")
        setLoader(false)
      }
    }
  });


  const [data, setData] = React.useState([]);
  console.log({ data });

  // Not using anywhere but it just to view/Fetch data
  React.useEffect(() => {
    // Fetch data using Axios when the component mounts
    axios.get('https://event.finliftconsulting.com.np/accounts/api/team-members/') // Replace with API endpoint
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <div className='team-form-body'>
        <form action="form"
          onSubmit={(e) => {
            handleSubmit(e)
          }} autoComplete='off'>
          <div className='form-group'>
            <label htmlFor="">Title</label>
            <input
              className='form-control'
              name='title'
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='form-group'>
            <label htmlFor="">Description</label>
            <textarea className='form-control'
              name="description"
              id=""
              cols={30}
              rows={3}
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
            ></textarea>
          </div>
          <div className='form-group'>
            <label htmlFor="">Location</label>
            <input
              className='form-control'
              name='location'
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='form-group'>
            <label htmlFor="">Start Date</label>
            <input
              className='form-control'
              name='start_date'
              type='datetime-local' // Use datetime-local for date and time
              value={values.start_date}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='form-group'>
            <label htmlFor="">End Date</label>
            <input
              className="form-control"
              type='datetime-local' // Use datetime-local for date and time
              name='end_date'
              value={values.end_date}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='form-group'>
            <label htmlFor="">Team Member</label>
            <select
              className='form-control'
              name="assigned_user_name"
              value={values.assigned_user_name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled
            >

              <option selected>--Select Team Member--</option>
              {TeamDetails && TeamDetails.map((item, index) => {
                return (
                  <option key={index}>{item.username}</option>
                )
              })}
            </select>
            <div className="color-indicator" style={{ backgroundColor: values.assigned_user_name && values.assigned_user_name.toLowerCase() }}></div>
          </div>
          <div className="button">
            <Button
              className='btn custom-btn text-white'
              type='submit'
              text="SUBMIT"
              disabled={isLoader}
              loading={isLoader}
            />
          </div>
        </form>
      </div >
    </div >
  );
};

const mapStateToProps = (state: RootState) => ({
  loading:
    state.taskData.updateTaskLogs.isFetching ||
    state.taskData.postTaskLogs.isFetching
});

const mapDispatchToProps = {
  getTeamMemberLogsAction,
  postTaskLogsAction,
  updateTaskLogsAction,
  getMemberLogsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(UserEditForm);
