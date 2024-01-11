import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from '../../../../../components/Notifier/Notifier';
import Button from '../../../../../components/UI/Forms/Buttons';
import { ConnectedProps, connect } from 'react-redux';
import { postCommentLogsAction } from '../../../../../store/modules/comment/postCommentLogs';
import { RootState } from '../../../../../store/root-reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import moment from 'moment';

const validationSchema = Yup.object({
});

interface CommentViewStyle {
  maxHeight: string;
  overflowY?: 'scroll' | 'visible' | 'hidden' | 'auto' | 'initial' | 'inherit';
}

interface Props extends PropsFromRedux {
  selectedEvent: any;
  toggleModal: () => void;
}

const Form = (props: Props) => {

  console.log(props.selectedEvent, "USER COMMENT ");

  //Active_Tab
  const [activeTab, setActiveTab] = React.useState("1");

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  const [initialData, setInitialData] = React.useState({
    task_id: props.selectedEvent?.id,
    title: props.selectedEvent?.title,
    username: props.selectedEvent?.assignee,
    // assignee: props.selectedEvent?.assignee,
    comment: "",
  });

  const [data, setData] = React.useState<any[]>([]);
  console.log({ data });

  // Not using anywhere but it just to view/Fetch data
  React.useEffect(() => {
    // Fetch data using Axios when the component mounts
    axios.get('https://event.finliftconsulting.com.np/accounts/api/comments/') // Replace with API endpoint
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const [combinedData, setCombinedData] = React.useState<any[]>([]);
  console.log({ combinedData });

  // Not using anywhere but it just to view/Fetch data
  React.useEffect(() => {
    // Fetch data using Axios when the component mounts
    axios.get('https://event.finliftconsulting.com.np/accounts/api/taskeditlogs/') // Replace with API endpoint
      .then((response) => {
        setCombinedData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const commentViewStyle: CommentViewStyle = {
    maxHeight: data.length > 3 ? '220px' : 'none',
    overflowY: data.length >= 3 ? 'auto' : 'visible',
  };

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
          props.toggleModal();
          toast.success("Data posted successful...!")
          // setData(prevData => [res.data, ...prevData]);
        } else {
          toast.error("Oops...Something is Wrong!")
          props.toggleModal();
        }
      } else {
        toast.error("SERVER ERROR")
      }
    }
  })

  return (
    <div className='user-comments'>
      <div className='user-body'>

        <form action="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e)
          }} autoComplete='off'>
          <div className="row">
            <div className="col-lg-10 col-10">

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
            <div className="col-lg-2 col-2">

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

      <Nav className='mb-3'>
        <NavItem>
          <NavLink
            className={activeTab === "1" ? 'active' : ''}
            onClick={() => {
              toggleTab("1")
            }}
          >
            Comments
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === "2" ? 'active' : ''}
            onClick={() => {
              toggleTab("2")
            }}
          >
            Edits
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <div className="comment-view" style={commentViewStyle}>
            {data && data.length === 0 ? (
              <span>No Comments Yet</span>
            ) : (
              data.slice(0).reverse().map((item) => (
                <div className="" key={item.id}>
                  {props.selectedEvent?.id === item.task_id && (
                    <>
                      <p style={{ fontSize: '16px' }} className='mb-0'> {item.comment} </p>
                      <span style={{ fontSize: '12px' }}>{moment(item.created_at).format('YYYY-MM-DD HH:mm a')} &nbsp; {item.username}</span>
                      <hr />
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </TabPane>
        <TabPane tabId="2">
          <div className="comment-view" style={commentViewStyle}>
            {combinedData && combinedData.length === 0 ? (
              <span>No Edits Yet</span>
            ) : (
              combinedData.slice(0).reverse().map((item) => (
                <div className="" key={item.id}>
                  {props.selectedEvent?.id === item.task_id && (
                    <>
                      <p style={{ fontSize: '16px' }} className='mb-0'> {item.comment} </p>
                        <span style={{ fontSize: '14px' }}><strong>{item.assignee_name}</strong> changed <strong> {item.field_name}</strong> from <strong>{item.old_value}</strong> to <strong>{item.new_value}</strong> on {item.formatted_timestamp}</span>
                      <hr />
                    </>
                  )}
                </div>
              ))
            )
            }
          </div>
        </TabPane>
      </TabContent>
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