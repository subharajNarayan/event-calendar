import React from 'react';
import { ConnectedProps, connect, useDispatch, useSelector } from 'react-redux';
import Button from '../../../../components/UI/Forms/Buttons';
import { useFormik } from 'formik';
import FormikValidationError from '../../../../components/React/FormikValidationError/FormikValidationError';
import toast from '../../../../components/Notifier/Notifier';
import { TeamInitialValues, validationSchema } from './schema';
import { RootState } from '../../../../store/root-reducer';
import { postTeamMemberLogsAction } from '../../../../store/modules/TeamMember/postTeamMemberLogs';
import { updateTeamMemberLogsAction } from '../../../../store/modules/TeamMember/updateTeamMemberLogs';
import { getTeamMemberLogsAction } from '../../../../store/modules/TeamMember/getTeamMemberLogs';

interface Props extends PropsFromRedux {
  toggleModal: () => void; // Add toggleModal prop
  editData: any;
}

const predefinedColors = [
  '#208ca2', // Red
];

const TeamMembForm = (props: Props) => {

  const [isLoader, setIsLoader] = React.useState(false);
  const [showColorOptions, setShowColorOptions] = React.useState(false);
  // console.log(props.editData, "AAYO SET EDIT");


  const [initialData, setInitialData] = React.useState<typeof TeamInitialValues>({
    ...TeamInitialValues, ...(props.editData || {})
  });

  console.log(initialData, "initialData");
  
  const dispatch = useDispatch();

  React.useEffect(() => {
    // if (props.editData) {
    //   setInitialData({
    //     ...props.editData,
    //   })
    // }
    if (props.editData) {
      setInitialData({
        ...props.editData,
      });
    } else {
      // Set default values for creating a new team member
      setInitialData({
        ...TeamInitialValues,
        color: predefinedColors[0], // Set the default color here
      });
    }
    dispatch(getTeamMemberLogsAction())
  }, [props.editData]);

  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useFormik({
    initialValues: props.editData || initialData,
    validationSchema: validationSchema,
    onSubmit: async (submitValue, { resetForm }) => {
      console.log('Submitting form with values:', submitValue);
      let res
      setIsLoader(true);

      if (props.editData && props.editData.id) {
        res = await props.updateTeamMemberLogsAction(props.editData.id, {
          ...submitValue,
        });
      } else {
        res = await props.postTeamMemberLogsAction({
          ...submitValue,
        });
      }
      

      if (res.status === 201 || res.status === 200) {
        if (props.editData) {
          setInitialData(TeamInitialValues)
          toast.success("Data Updated Successful...!")
          resetForm()
          // setLoader(false);
          props.toggleModal()
        } else {
          setInitialData(TeamInitialValues)
          toast.success("Data Posted Successful...!")
          resetForm()
          // setLoader(false)
        }
      } else {
        toast.error("SERVER ERROR")
        // setLoader(false)
      }
    }
  })

  return (
    <div>
      <div className='team-form-body'>
        <form action="form"
          onSubmit={(e) => {
            handleSubmit(e)
          }} autoComplete='off'>
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
            <label htmlFor="">Phone No. <span className="text-danger">*</span></label>
            <input
              className='form-control'
              name='contactnumber'
              value={values.contactnumber}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='form-group'>
            <label htmlFor="">Email <span className="text-danger">*</span></label>
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
            <label htmlFor="">Password <span className="text-danger">*</span></label>
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
                type="color"
                name="color"
                value={values.color || predefinedColors[0]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div className="button">
            <Button
              className='btn custom-btn text-white'
              type='submit'
              text="SUBMIT"
              disabled={props.loading}
              loading={props.loading}
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