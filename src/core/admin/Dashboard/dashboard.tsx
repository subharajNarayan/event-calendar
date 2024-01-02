import React, { ReactElement, Suspense } from 'react';
import { connect, ConnectedProps, useDispatch } from "react-redux";
import PrivateRoute from '../../../routes/PrivateRoute/PrivateRoute';
import useAuthentication from '../../../services/authentication/AuthService';
import { RootState } from '../../../store/root-reducer';

import AppHeader from './Header/Header'
import Sidebar from './Sidebar/sidebar'
import AppFooter from './Footer/footer'
import "../../../assets/dashboard/scss/style.scss"
import FallbackLoader from '../../../components/React/FallBackLoader/FallBackLoader'
import Home from '../../public/Home/Home'
import { useNavigate } from 'react-router-dom';
// import Form from '../pages/form/Form';
import List from '../pages/list/List';
import Pagination from '../pages/pagination/Pagination';
import appRoutes from "../../../routes/routes";
import AppSidebar from './Sidebar/sidebar';

interface Props extends PropsFromRedux {
  children: any;
}

function AdminDashboard(props: Props): ReactElement {
  const [sidebarToggle, setsidebarToggle] = React.useState(false);
  const { children } = props;
  const navigate = useNavigate;
  const { isAuthenticated } = useAuthentication();

  React.useEffect(() => {
    // check api valid token
    // /user/token/verify
    // true/false
    // if not valid redirect to login
    // if valid do nothing
  }, []);
  
  return (
    <Suspense fallback={<FallbackLoader />}>
      <div
        className={`app theme-dark-blue ${sidebarToggle ? "toggled" : ""}`}
        style={{ position: "relative" }}
      >
        {/* <Sidebar sidebarToggle={sidebarToggle} setsidebarToggle={setsidebarToggle} /> */}
        <main className="stickyHeader">
          <AppHeader sidebarToggle={sidebarToggle} setsidebarToggle={setsidebarToggle} />
          <div className="body flex-grow-1 px-3">

          <PrivateRoute
          appRoutes={appRoutes.filter((route) => route.type !== "login")}
          redirectPath={[{ from: "*", to: isAuthenticated() ? "/admin/home" : "home" }]}
        />
          </div>
          {/* <AppFooter /> */}
        </main>
      </div>
    </Suspense>
  )
}
const mapStateToProps = (state: RootState) => ({
});

const mapDispatchToProps = {
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AdminDashboard);
