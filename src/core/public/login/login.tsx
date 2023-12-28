import Button from "../../../components/UI/Forms/Buttons";
import { useFormik } from "formik";
import React, { ReactElement, useCallback, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../../store/modules/login/login";
import { addUserDetails } from "../../../store/modules/userDetails";
import { RootState } from "../../../store/root-reducer";
import { object as YupObject, string as YupString } from "yup";
import '../login/login.scss';
import '../authSocial/social.scss';
import toast from "../../../components/Notifier/Notifier";
import TokenService from "../../../services/jwt-token/jwt-token";
// import { useGoogleLogin } from '@react-oauth/google';
import FormikValidationError from "../../../components/React/FormikValidationError/FormikValidationError";

interface Props extends PropsFromRedux { }
export interface UserCredentials {
  username: string;
  password: string;
}

function Login(props: Props): ReactElement {
  const history = useNavigate();
  const { loginData, loginUser } = props;
  // const i18nextData = useSelector((state: RootState) => state.i18nextData, shallowEqual);

  const handleLogin = useCallback(
    async (userDetails: UserCredentials) => {
      const loginres: any = await loginUser(userDetails);
      
      console.log({loginres});
      
      if (loginres?.data?.access) {
        // toast.success("Logged In Successful")
        toast.success(loginres.data.message)
        
        props.addUserDetails(loginres.data);
        console.log({d:loginres.data});
        if (loginres?.data?.role === "Admin") {          
          history("/admin/home");
        } else {
          history("/auth/home");
        }
      } else {
        // toast.error(loginres?.data?.message)
        toast.error("Server Error")
        // toast.error("Server is taking too long to respond, please try again in sometime!");
      }
    },
    [loginUser, history, props]
  );



  return (
    <div className="app bg-white">
      <div className="container">
        <div className="auth-wrapper">
          <LoginForm handleLogin={handleLogin} authorizing={loginData.isFetching} />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  loginData: state.loginData,
});

const mapDispatchToProps = {
  loginUser: loginUser,
  // switchI18nLanguage: switchI18nLanguage,
  addUserDetails: addUserDetails,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Login);

interface LoginFormProps {
  handleLogin: (credentials: UserCredentials) => void;
  /**Status indicating if login is initiating */
  authorizing: boolean;
}
const LoginForm = ({ authorizing, handleLogin }: LoginFormProps) => {
  // const { t } = useTranslation(["login", "register"]);

  const [passwordView, showPassword] = useState(false);
  const togglePassword = () => showPassword(!passwordView);
  const [initialValue] = useState({ username: "", password: "" });

  const loginValidationSchema = YupObject().shape({
    username: YupString().required("This Field id Required"),
    password: YupString().required("This Field id Required"),
  });

  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: initialValue,
    validationSchema: loginValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(false);
      handleLogin(values);
    },
  });

  const history = useNavigate();

  return (
    <div className="auth-body">
      <form className="" onSubmit={handleSubmit} autoComplete="off">
        {/* <h5 className="mb-2 font-bold">Water</h5> */}
        <p className="">DYNASEl USA - TASK MANAGER</p>

        <h6 className="mb-2 font-bold">CONFIGURATIONS</h6>

        <div className="auth-form">
          <div className="form-group align-vertical">
            <label htmlFor="" className="mr-4 label">
              Username
            </label>
            <input
              className="form-control"
              name="username"
              value={values.username}
              onChange={handleChange}
              required
            />
            <FormikValidationError name="username" errors={errors} touched={touched} />
          </div>

          <div className="form-group align-vertical mt-4">
            <label htmlFor="" className="mr-4 label">
              Password
            </label>

            <input
              className="form-control"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              required
            />

            <span
              className={`${passwordView ? "ic-view" : "ic-hidden"} text-coolGray600`}
              role="button"
              onClick={togglePassword}
            ></span>
            <FormikValidationError name="password" errors={errors} touched={touched} />
          </div>

          <div className="auth-footer">
            <Button
              className="btn btn-outlined-primary"
              text={"Login"}
              loading={authorizing}
              disabled={authorizing}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
