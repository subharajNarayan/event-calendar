import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from '../../../../../components/Notifier/Notifier';
import Button from '../../../../../components/UI/Forms/Buttons';


const validationSchema = Yup.object({
});

interface Props {
  // events: any
}

const Form = (props: Props) => {

  const [isLoader, setIsLoader] = React.useState(false);

  // console.log(props.events, "Form");


  const [initialData, setInitialData] = React.useState({
    comment: "",
  });

  console.log({ initialData });


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
      setIsLoader(true);
      try {
        // Include 'color' in the payload
        // const payload = { ...values, color: values.color || predefinedColors[0] };

        // Make sure to replace the URL with your actual API endpoint
        await axios.post('http://localhost:5000/api/register')
          .then((response) => {
            setInitialData(response.data);
            toast.success('Hooray... Data posted Successful');
            resetForm();
          });
      } catch (error) {
        console.error('Error:', error);
        toast.error('Oops! Something went wrong.');
      }
      setIsLoader(false)
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
            <label htmlFor="">Address <span className="text-danger">*</span></label>
            <textarea name="comment" id=""
              cols={30}
              rows={2}
              placeholder='Comment Here'
              className='form-control'
              value={values.comment}
              onChange={handleChange}
              onBlur={handleBlur}
            >
            </textarea>
          </div>
          <div className="button">
            <Button
              className='btn custom-btn text-white'
              type='submit'
              text="SUBMIT"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Form;