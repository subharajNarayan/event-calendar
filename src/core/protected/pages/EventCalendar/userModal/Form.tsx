import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from '../../../../../components/Notifier/Notifier';
import Button from '../../../../../components/UI/Forms/Buttons';
import { ConnectedProps, connect} from 'react-redux';
import { postCommentLogsAction } from '../../../../../store/modules/comment/postCommentLogs';
import { RootState } from '../../../../../store/root-reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowRight } from '@fortawesome/free-solid-svg-icons';

const validationSchema = Yup.object({
});

interface Props extends PropsFromRedux {
  selectedEvent: any;
  toggleModal: () => void;
}

const Form = (props: Props) => {

  // console.log(props.selectedEvent, "USER COMMENT ");

  const [initialData, setInitialData] = React.useState({
    task_id: props.selectedEvent?.id,
    title: props.selectedEvent?.title,
    username: props.selectedEvent?.assigned_user_name,
    comment: "",
  });

  const [data, setData] = React.useState<any[]>([]);
  // console.log({ data });

  // Not using anywhere but it just to view/Fetch data
  React.useEffect(() => {
    // Fetch data using Axios when the component mounts
    axios.get('https://kyush.pythonanywhere.com/accounts/api/comments/') // Replace with API endpoint
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const [commentCheck, setCommentCheck] = React.useState<any[]>([]);
  console.log({ commentCheck });

  // Not using anywhere but it just to view/Fetch data
  React.useEffect(() => {
    // Fetch data using Axios when the component mounts
    axios.get('https://kyush.pythonanywhere.com/accounts/api/combined_data/') // Replace with API endpoint
      .then((response) => {
        setCommentCheck(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  React.useEffect(() => {
    console.log('Component Data:', data);
  }, [data]);

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
      let res: any;

      res = await props.postCommentLogsAction({
        ...submitValue
      })
      if (res.status === 200 || res.status === 201) {
        if (res.status === 200 || res.status === 201) {
          setInitialData(initialData)
          resetForm();
          // Update data state directly to ensure immediate re-render
          setData([res.data, ...data]);
          toast.success("Data posted successful...!")
        } else {
          toast.error("Oops...Something is Wrong!")
          // props.toggleModal();
        }
      } else {
        toast.error("SERVER ERROR")
      }
    }
  })

  return (
    <div>
      <div className='user-body'>

        <form action="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e)
          }} autoComplete='off'>
          <div className="row">
            <div className="col-lg-10">

              <div className='form-group'>
                <textarea name="comment"
                  cols={30}
                  rows={1}
                  placeholder='Comment Here'
                  className='form-control'
                  value={values.comment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                </textarea>
              </div>
            </div>
            <div className="col-lg-2">

              <div className="button">
                <Button
                  style={{ padding: "3px 16px" }}
                  className='btn custom-btn text-white'
                  type='submit'
                  // text="SUBMIT"
                  disabled={props.loading}
                  loading={props.loading}
                >
                  <FontAwesomeIcon icon={faLongArrowRight} />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <hr />
      <div className="comment-view">
        {data?.slice(0).reverse().map((item) => {
          return (
            <div className="" key={item.id}>
              {props.selectedEvent?.id === item.task_id && (
                <>
                  <p style={{ fontSize: '16px' }} className='mb-0'> {item.comment} </p>
                  <span style={{ fontSize: '12px' }}>{item.created_at} &nbsp; {item.username}</span>
                  <hr />
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  loading: state.commentData.postCommentLogs.isFetching
})

const mapDispatchToProps = {
  // getCommentLogsAction,
  postCommentLogsAction
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(Form);