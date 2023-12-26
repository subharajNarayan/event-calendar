import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from '../../../../../components/Notifier/Notifier';
import Button from '../../../../../components/UI/Forms/Buttons';
import { ConnectedProps, connect, useDispatch, useSelector } from 'react-redux';
import { postCommentLogsAction } from '../../../../../store/modules/comment/postCommentLogs';
import { RootState } from '../../../../../store/root-reducer';

const validationSchema = Yup.object({
});

interface Props extends PropsFromRedux {
  selectedEvent: any;
}

const Form = (props: Props) => {

  const [isLoader, setIsLoader] = React.useState(false);

  const [initialData, setInitialData] = React.useState({
    comment: "",
    // Add other fields from selectedEvent as needed
    // eventId: props.selectedEvent.id,
    title: props.selectedEvent.title,
    username: props.selectedEvent.assigned_user_name,
  });
console.log({initialData});

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
      let res;
      setIsLoader(true);

      res = await props.postCommentLogsAction({
        ...submitValue
      })
      if (res.status === 200 || res.status === 201) {
        if (res.status === 200) {
          setInitialData(initialData)
          resetForm();
          toast.success("Data posted successful...!")
        } else {
          toast.error("Oops...Something is Wrong!")
        }
      } else {
        toast.error("SERVER ERROR")
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
            <textarea name="comment" 
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
              disabled={props.loading}
              loading={props.loading}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

const mapStateToProps = (state:RootState) => ({
  loading: state.commentData.postCommentLogs.isFetching
})

const mapDispatchToProps = {
  postCommentLogsAction
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(Form);