import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import appRoutes from "./routes/routes";
import PrivateRoute from "./routes/PrivateRoute/PrivateRoute";
import useAuthentication from "./services/authentication/AuthService";
import TokenService from "./services/jwt-token/jwt-token";
import { RootState } from "./store/root-reducer";
import "./App.scss";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useLocation} from "react-router-dom";
import Dashboard from "./core/protected/Dashboard/dashboard";
import AdminDashboard from "./core/admin/Dashboard/dashboard";
// Make sure you have Font Awesome included in your project

// import toast from "./components/Notifier/Notifier";
// import { useDispatch, useSelector } from "react-redux";
// import {addUserDetails} from "./store/modules/userDetails";
// import { geti18nLanguage, switchI18nLanguage } from "./store/modules/i18n/i18n";
// Initialize Notification Toaster


function App() {
  const {
    i18nextData: { languageType },
  } = useSelector((state: RootState) => ({ i18nextData: state.i18nextData }));
  // const dispatch = useDispatch();

  const { isAuthenticated } = useAuthentication();

  
  // Disable Console
  useEffect(() => {
    // Disable Console during production
    if (process.env.NODE_ENV === "production") {
      console.log = function () {};
      window.console.log =
        window.console.debug =
        window.console.info =
        window.console.error =
          function () {
            return false;
          };
    }
  }, []);

  const location = useLocation()
  const SignupCheck = () =>{
    if (location.pathname === "/signup"){
      return "Siguup"
    }
   
  }

  
  // console.log(location, location.pathname, "testtt")

  //fetch token from localstorage and set details on reducer
  const [ isRole, setIsRole ] = React.useState<any>('');
  // console.log({isRole});
  const tok = TokenService.getAccessToken();

  useEffect(() => {
    const userDetails = tok;
    // setIsRole('');
    
    if (userDetails?.role?.toLowerCase() === "admin") {
      setIsRole("ADMIN")
    } else if (userDetails?.role?.toLowerCase() === "team_member") {
      setIsRole("Team_Member")
    } else {
      setIsRole("")
    }
    // console.log(userDetails);
    
  }, [tok?.role]);



  function roleDashboard(role:null|string=null) {
    console.log({role});
    
    switch(role?.toUpperCase()) {
      case 'ADMIN' : return <AdminDashboard children={[]}></AdminDashboard>
    }

    console.log({role, admin: false});
    
    return <Dashboard children={[]}></Dashboard>;
  }
  

  return (
    <>
      <ToastContainer />
      {isAuthenticated() ? (
        roleDashboard(isRole)
        // {callRoute}
      )
      :
      SignupCheck()?(
        <PrivateRoute
          appRoutes={appRoutes.filter((route) => route.type !== "login")}
          redirectPath={[{ from: "/login", to: "/signup" }]}
        />
      )
      :
      (
        <PrivateRoute
          appRoutes={appRoutes.filter((route) => {
            return (
              route.children?.filter((item) => item.type !== "authorized") ||
              route.type === "login"
            );
          })}
          redirectPath={[{ from: "*", to: "/login" }]}
        />
      )}
    </>
  );
}

export default App;
