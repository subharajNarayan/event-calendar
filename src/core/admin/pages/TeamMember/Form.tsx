import React from 'react';
import { ConnectedProps, connect, useDispatch, useSelector } from 'react-redux';
import Button from '../../../../components/UI/Forms/Buttons';
import { useFormik } from 'formik';
import FormikValidationError from '../../../../components/React/FormikValidationError/FormikValidationError';
// import toast from '../../../../components/Notifier/Notifier';
import { TeamInitialValues, TeamValidationSchema } from './schema';
import { RootState } from '../../../../store/root-reducer';
import { postTeamMemberLogsAction } from '../../../../store/modules/TeamMember/postTeamMemberLogs';
import { updateTeamMemberLogsAction } from '../../../../store/modules/TeamMember/updateTeamMemberLogs';
import { getTeamMemberLogsAction } from '../../../../store/modules/TeamMember/getTeamMemberLogs';
import { toast } from 'react-toastify';


interface Props extends PropsFromRedux {
  toggleModal: () => void; // Add toggleModal prop
  editData: any;
  success: () => void;
}

const TeamMembForm = (props: Props) => {

  const [isLoader, setIsLoader] = React.useState(false);

  const [isColor, setIsColor] = React.useState("")
  console.log(isColor, "IS COLOR");

  const generateColor = () => {
    const newColor = '#' + Math.random().toString(16).substr(-6);
    setIsColor(newColor);

    // Use the setFieldValue from useFormik to update the form's color field
    setFieldValue('color', newColor);
  };

  const [initialData, setInitialData] = React.useState<typeof TeamInitialValues>({
    ...TeamInitialValues, ...(props.editData || {}),
  });
  console.log(initialData, "INITIAL DATA");

  const dispatch = useDispatch();

  console.log(props.editData, "EDIT DATA");

  React.useEffect(() => {
    if (props.editData) {
      setInitialData({
        ...props.editData,
      });
      setIsColor(props.editData?.color || '');
    }
    dispatch(getTeamMemberLogsAction());
  }, [props.editData?.username]);


  React.useEffect(() => {
    // Set a default color only when creating a new user
    generateColor();
  }, []);
  // React.useEffect(() => {
  //   if (props.editData) {
  //     setInitialData({
  //       ...props.editData,
  //       // color: props.editData?.color || '',
  //     });
  //     setIsColor(props.editData?.color || '');
  //   }
  //   // Set a default color when the component mounts
  //   // generateColor();
  //   dispatch(getTeamMemberLogsAction())
  // }, [props.editData?.username]);

  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema: TeamValidationSchema,
    onSubmit: async (submitValue, { resetForm }) => {
      let res
      setIsLoader(true);

      try {
        // Log to console to check if the color is being set properly
        console.log('Color before submission:', values.color);
        const colorDetails = {
          ...submitValue,
          color: values.color, // Include color value in the submission
        }

        // Log to console to check if colorDetails includes the color field
        console.log('Color Details:', colorDetails);

        if (props.editData && props.editData.id) {
          res = await props.updateTeamMemberLogsAction(props.editData.id, colorDetails);
        } else {
          // For new user (post operation), generate a new color
          // generateColor();
          res = await props.postTeamMemberLogsAction(colorDetails);
        }

        if (res.status === 201 || res.status === 200) {
          if (props.editData && props.editData.id) {
            setInitialData(TeamInitialValues)
            toast.success("Data Updated Successful...!")
            resetForm()
            props.toggleModal()
            props.success();
            setIsLoader(false);
          } else {
            setInitialData(TeamInitialValues)
            toast.success("Data Posted Successful...!")
            resetForm()
            props.success();
            props.toggleModal()
            setIsLoader(false);
          }
        } else {
          // Failed login attempt
          if (res?.status === 400) {
            console.error("loginres", res?.message); // Log the message to the console

            // Convert the object to a string for display in the toast
            const errorMessage = res?.message ? JSON.stringify(res.message) : '';
            // Remove square brackets from the error message
            const formattedErrorMessage = errorMessage.replace(/[\[\]"]+/g, '');

            toast.error(formattedErrorMessage);
            setIsLoader(false);
          }
          else {
            toast.error("Oops... Something is Wrong!")
            setIsLoader(false);
          }
        }
      }
      catch (error) {
        toast.error("Server Error")
        setIsLoader(false);
      }
    }
  })

  // Use useEffect to ensure that the color is set before submitting the form
  React.useEffect(() => {
    setFieldValue('color', isColor);
  }, [isColor]);


  return (
    <div>
      <div className='team-form-body'>
        <form action="form"
          onSubmit={handleSubmit} autoComplete='off'>
          <div className='form-group'>
            <label htmlFor="">Username <span className='text-danger'>*</span></label>
            <input
              className='form-control'
              name='username'
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name='username' errors={errors} touched={touched} />
          </div>
          <div className='form-group'>
            <label htmlFor="">Phone No.</label>
            <input
              className='form-control'
              name='contactnumber'
              value={values.contactnumber}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name='contactnumber' errors={errors} touched={touched} />
          </div>
          <div className='form-group'>
            <label htmlFor="">Email</label>
            <input
              className="form-control"
              name='email'
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* <FormikValidationError name='email' errors={errors} touched={touched} /> */}
          </div>
          <div className='form-group'>
            <label htmlFor="">Password  <span className="text-danger">*</span></label>
            <input
              type='password'
              className="form-control"
              name='password'
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name='password' errors={errors} touched={touched} />
          </div>
          <div className='form-group colors-name d-flex'>
            <label htmlFor="">Color </label>
            <div className="color-input-container">
              <input
                type='color'
                name='color'
                value={isColor}
                onChange={(e) => {
                  setIsColor(e.target.value);
                }}
                onBlur={handleBlur}
              />
            </div>
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
      </div>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  loading:
    state.teamMemberData.updateTeamMemberLogs.isFetching ||
    state.teamMemberData.postTeamMemberLogs.isFetching
});

const mapDispatchToProps = {
  getTeamMemberLogsAction,
  postTeamMemberLogsAction,
  updateTeamMemberLogsAction
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TeamMembForm);