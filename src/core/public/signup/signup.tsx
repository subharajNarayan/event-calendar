import React, { ReactElement, useCallback } from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import FormikValidationError from '../../../components/React/FormikValidationError/FormikValidationError';
import Button from "../../../components/UI/Forms/Buttons";
import "../signup/signup.scss";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/root-reducer";
import { useNavigate, Link } from "react-router-dom";
import toast from "../../../components/Notifier/Notifier";
import { userRegister } from '../../../store/modules/register/register';
import { addUserDetails } from "../../../store/modules/userDetails";


interface Props extends PropsFromRedux { }
export interface UserRegister {
  username: string;
  email: string;
  phone: string;
  password: string;
  password2: string;
}

function Signup(props: Props): ReactElement {
  const { registerData, userRegister } = props;

  const history = useNavigate();
  // const i18nextData = useSelector((state: RootState) => state.i18nextData, shallowEqual);

  const handleRegister = useCallback(
    async (userDetails: UserRegister) => {
      const registeres: any = await userRegister(userDetails);

      if (registeres?.status === 201) {
        // toast.success(registeres.data.message)
        toast.success("User Registration Successful")
        console.log(registeres?.data.message, "Success");
        history("/login");
      } else {
        // console.log(registeres, "555555555555555")
        if (registeres?.message?.email) {
          toast.error("Email is already in use")
        } else if (registeres?.message.phone) {
          toast.error("Phone is already in use");
        }
        else {
          toast.error("Server Error")
        }

        // Configure(errorMessage, loginres?.status)
      }
    },
    [userRegister, history]
  );


  return (
    <div className="app bg-white">
      <div className="container">
        <div className="auth-wrapper">
          <SignupForm handleRegister={handleRegister} authorizing={registerData.isFetching} />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  registerData: state.registerData,

});

const mapDispatchToProps = {
  userRegister: userRegister,
  addUserDetails: addUserDetails,
};


const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Signup)

interface SignupFormProps {
  handleRegister: (credentials: UserRegister) => void;
  /**Status indicating if login is initiating */
  authorizing: boolean;
}


const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const signupValidationSchema = Yup.object().shape({
  firstname: Yup.mixed().nullable().required("This field is required"),
  lastname: Yup.mixed().nullable().required("This field is required"),
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
  phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required("This field is required"),
  password: Yup.string()
    .min(8, "Password must be 8 characters at minimum")
    .required("password is Required"),
  password2: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Password does not match')
    .required("This field is required"),

})


const SignupForm = ({ handleRegister, authorizing }: SignupFormProps) => {

  const [passwordView, showPassword] = React.useState(false);
  const togglePassword = () => showPassword(!passwordView);

  const [initialValue, setInitialValue] = React.useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });
  // console.log({setInitialValue});



  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched } = useFormik({
      initialValues: initialValue,
      validationSchema: signupValidationSchema,
      onSubmit: (values, { setSubmitting, resetForm }) => {
        // let response;
        setSubmitting(false);
        handleRegister(values);
        resetForm();
        toast.success("User Added Successfull")
      }
    })

  return (
    <div className='auth-signupbody'>
      <form className='' autoComplete='off' onSubmit={handleSubmit}>
        <p className=''>PLEASE REGISTER HERE</p>
        <div className='auth-signupform'>
          {/* <div className='row'> */}
            {/* <div className='form-group col-lg-6'>
              <label htmlFor="" className='mr-4 label'>
                First Name:
              </label>
              <input
                name='firstname'
                className='form-control'
                value={values.firstname}
                onChange={handleChange}
                required
              />
              <FormikValidationError name='firstname' errors={errors} touched={touched} />
            </div> */}
            <div className='form-group'>
              <label htmlFor="" className='mr-4 label'>
                Username:
              </label>
              <input
                name='username'
                className='form-control'
                value={values.username}
                onChange={handleChange}
                required
              />
              <FormikValidationError name='username' errors={errors} touched={touched} />
            </div>
          {/* </div> */}
          <div className='form-group '>
            <label htmlFor="" className='mr-4 label'>
              Email
            </label>
            <input
              name='email'
              className='form-control'
              value={values.email}
              onChange={handleChange}
              required
            />
            <FormikValidationError name='email' errors={errors} touched={touched} />
          </div>
          <div className='form-group '>
            <label htmlFor="" className='mr-4 label'>
              Phone
            </label>
            <input
              name='phone'
              className='form-control'
              value={values.phone}
              onChange={handleChange}
              required
            />
            <FormikValidationError name='phone' errors={errors} touched={touched} />
          </div>
          <div className='form-group '>
            <label htmlFor="" className='mr-4 label'>
              Password
            </label>
            <input type="password"
              name='password'
              className='form-control'
              value={values.password}
              onChange={handleChange}
              required
            />
            <span
              className={`${passwordView ? "ic-view" : "ic-hidden"} text-coolGray600`}
              role="button"
              onClick={togglePassword}
            ></span>
            <FormikValidationError name='password' errors={errors} touched={touched} />
          </div>
          <div className='form-group '>
            <label htmlFor="" className='mr-4 label'>
              Confirm Password
            </label>
            <input type="password"
              name='password2'
              className='form-control'
              value={values.password2}
              onChange={handleChange}
              required
            />
            <span
              className={`${passwordView ? "ic-view" : "ic-hidden"} text-coolGray600`}
              role="button"
              onClick={togglePassword}
            ></span>
            <FormikValidationError name='password2' errors={errors} touched={touched} />
          </div>
          <div className="auth-footer">
            <Button
              className="btn btn-outlined-primary"
              // text={t("login:title")}
              text={"Sign In"}
              disabled={authorizing}
              loading={authorizing}
            />
          </div>
        </div>
      </form>
      <div className="auth-signup">
        <p className="">Already have an account?
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}