import React from 'react';
import { ConnectedProps, connect, useDispatch, useSelector } from 'react-redux';
import Button from '../../../../components/UI/Forms/Buttons';
import { useFormik } from 'formik';
import FormikValidationError from '../../../../components/React/FormikValidationError/FormikValidationError';
import toast from '../../../../components/Notifier/Notifier';
import { TeamInitialValues, validationSchema } from './schema';
import { RootState } from '../../../../store/root-reducer';
import { postTeamMemberLogsAction } from '../../../../store/modules/TeamMember/postTeamMemberLogs';

interface Props extends PropsFromRedux {

}

const predefinedColors = [
  '#208ca2', // Red
];

const TeamMembForm = (props: Props) => {

  const [isLoader, setIsLoader] = React.useState(false);
  const [showColorOptions, setShowColorOptions] = React.useState(false);


  const [initialData, setInitialData] = React.useState<typeof TeamInitialValues>({
    ...TeamInitialValues
  });

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

      let res
      setIsLoader(true);

      res = await props.postTeamMemberLogsAction({
        ...submitValue
      })

      if (res.status === 200 || res.status === 201) {
        if (res.status === 200) {
          setInitialData(TeamInitialValues)
          resetForm()
          toast.success("Data Posted Successful...!")
        } else {
          toast.error("Oops! Something went wrong...")
        }
      }else{
        toast.error("SERVER ERROR...")
      }
      setIsLoader(false)
    }
  })

  // const toggleColorOptions = () => {
  //   setShowColorOptions(!showColorOptions);
  // };

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
            <label htmlFor="">Address <span className="text-danger">*</span></label>
            <input
              className='form-control'
              name='address'
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name='address' errors={errors} touched={touched} />
          </div>
          <div className='form-group'>
            <label htmlFor="">Contact No. <span className="text-danger">*</span></label>
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
            <label htmlFor="">Email <span className="text-danger">*</span></label>
            <input
              className="form-control"
              name='email'
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name='email' errors={errors} touched={touched} />
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
    state.teamMemberData.postTeamMemberLogs.isFetching
});

const mapDispatchToProps = {
  postTeamMemberLogsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TeamMembForm);