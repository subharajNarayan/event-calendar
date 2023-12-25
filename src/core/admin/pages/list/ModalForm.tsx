import React from 'react';
import Button from '../../../../components/UI/Forms/Buttons';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import FormikValidationError from '../../../../components/React/FormikValidationError/FormikValidationError';
import toast from '../../../../components/Notifier/Notifier';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  firstname: Yup.string().nullable().required('This field is required'),
  lastname: Yup.string().nullable().required('This field is required'),
  address: Yup.string().nullable().required('This field is required'),
  message: Yup.mixed().nullable().required('This field is required'),
  email: Yup.string().email('Invalid email address').required('This field is requied')
    .test(
      'valid-email-at',
      'Email must contain "@"',
      (value) => {
        if (value) {
          return value.includes('@');
        }
        return false;
      }
    )
    .test(
      'valid-email-com',
      'Email must end with ".com"',
      (value) => {
        if (value) {
          return value.endsWith('.com');
        }
        return false;
      }
    ),
})

interface Props{}


const ModalForm = (props:Props) => {

  const [ isLoader, setIsLoader ] = React.useState(false);

  const [initialState, setInitialState] = React.useState({
    firstname: '',
    middlename: '',
    lastname: '',
    address: '',
    email: '',
    message: '',
  })
  

  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    onSubmit: async(values, { resetForm }) => {
      setIsLoader(true);
      try {
        await axios.post('http://localhost:5000/api/register', values)
        .then((response) => {
          setInitialState(response.data)
          toast.success("Hooray... Data posted Successful")
          resetForm();
        })
      } catch (error) {
        console.log(error);
      }
      setIsLoader(false)
    }
  })

  return (
    <section className="form p-4">
      <div className='form-start'>
        {/* <div className='form-heading'>
          <h4>REGISTER HERE</h4>
        </div> */}
        <div className='form-body'>
          <form action="form" onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e)
          }} autoComplete='off'>
            <div className="row">
              <div className="col-lg-4 col-md-4 col-12">
                <div className='form-group'>
                  <label htmlFor="">First Name <span className='text-danger'>*</span></label>
                  <input type="text" className='form-control'
                    placeholder='Add FirstName'
                    name='firstname'
                    value={values.firstname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FormikValidationError errors={errors} touched={touched} name='firstname' />
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-12">
                <div className='form-group'>
                  <label htmlFor="">Middle Name</label>
                  <input type="text" className='form-control'
                    placeholder='Add MiddleName'
                    name='middlename'
                    value={values.middlename}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-12">
                <div className='form-group'>
                  <label htmlFor="">Last Name <span className="text-danger">*</span></label>
                  <input type="text" className='form-control'
                    placeholder='Add LastName'
                    name='lastname'
                    value={values.lastname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FormikValidationError errors={errors} touched={touched} name='lastname' />
                </div>
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor="">Address <span className="text-danger">*</span></label>
              <input type="text" className="form-control"
                placeholder='Add Address'
                name='address'
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormikValidationError errors={errors} touched={touched} name='address' />
            </div>
            <div className='form-group'>
              <label htmlFor="">Email <span className="text-danger">*</span></label>
              <input type="text" className="form-control"
                placeholder='Add Email'
                name='email'
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormikValidationError errors={errors} touched={touched} name='email' />
            </div>
            <div className="form-group">
              <label htmlFor="">Message <span className="text-danger">*</span></label>
              <textarea name="message" id="message" cols={10} rows={5}
                placeholder='Text Here'
                className='form-control'
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormikValidationError errors={errors} touched={touched} name='message' />
            </div>
            <div className="button">
              <Button
                className='btn custom-btn'
                type='submit'
                text="SUBMIT"
                loading={isLoader}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ModalForm;