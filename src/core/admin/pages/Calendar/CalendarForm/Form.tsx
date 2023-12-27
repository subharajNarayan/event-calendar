import React, { useState } from 'react';
import { ConnectedProps, connect, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { taskInitialValues, taskValidationSchema } from './schema';
import { useFormik } from 'formik';
import { getTeamMemberLogsAction } from '../../../../../store/modules/TeamMember/getTeamMemberLogs';
import { postTaskLogsAction } from '../../../../../store/modules/Tasks/postTaskLogs';
import { updateTaskLogsAction } from '../../../../../store/modules/Tasks/updateTaskLogs';
import toast from '../../../../../components/Notifier/Notifier';
import Button from '../../../../../components/UI/Forms/Buttons';
import { RootState } from '../../../../../store/root-reducer';

interface Props extends PropsFromRedux {
  editData: any,
  toggleModal: () => void;
}

const CalendarForm = (props: Props) => {

  const [initialData, setInitialData] = useState<typeof taskInitialValues>({
    ...taskInitialValues, ...(props.editData || {})
  });

  const TeamDetails = useSelector((state: RootState) => state.teamMemberData.getTeamMemberLogs.data);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (props.editData) {
      setInitialData({
        ...props.editData,
      })
    }
    dispatch(getTeamMemberLogsAction())
  }, [props.editData]);


  const [loader, setLoader] = React.useState(false);

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

      let res;
      setLoader(true);


      if (props.editData?.id) {
        res = await props.updateTaskLogsAction(props.editData.id, {
          ...submitValue
        })
      } else {
        res = await props.postTaskLogsAction({
          ...submitValue
        })
      }

      if (res.status === 201 || res.status === 200) {
        if (props.editData) {
          setInitialData(taskInitialValues)
          toast.success("Data Updated Successful...!")
          resetForm()
          setLoader(false);
          props.toggleModal()
        } else {
          setInitialData(taskInitialValues)
          toast.success("Data Posted Successful...!")
          resetForm()
          setLoader(false)
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
    axios.get('https://kyush.pythonanywhere.com/accounts/api/team_member') // Replace with API endpoint
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
            >

              <option selected>--Select Team Member--</option>
              {TeamDetails && TeamDetails.map((item, index) => {
                return (
                  <option key={index}>{item.username}</option>
                )
              })}
              {/* <option value="Subharaj">Subharaj </option>
              <option value="Srijan">Srijan</option>
              <option value="Kyush">Kyush</option>
              <option value="Shreyas">Shreyas</option> */}
            </select>
            <div className="color-indicator" style={{ backgroundColor: values.assigned_user_name && values.assigned_user_name.toLowerCase() }}></div>
          </div>
          <div className="button">
            <Button
              className='btn custom-btn text-white'
              type='submit'
              text="SUBMIT"
            />
          </div>
        </form>
      </div >
    </div >
  );
};

const mapStateToProps = (state: RootState) => ({
  loading:
    state.taskData.postTaskLogs.isFetching
});

const mapDispatchToProps = {
  getTeamMemberLogsAction,
  postTaskLogsAction,
  updateTaskLogsAction
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CalendarForm);
