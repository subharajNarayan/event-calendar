import React, { Children, Suspense } from "react";
import { Route, Routes, useLocation, Navigate, RouterProps, RouterProvider } from "react-router-dom";
import FallbackLoader from "../../components/React/FallBackLoader/FallBackLoader";
import ErrorBoundary from "../../components/React/ErrorBoundary/ErrorBoundary";


// import Signup from "../../core/public/signup/signup";
// import ErrorBoundary from "../../components/React/ErrorBoundary/ErrorBoundary";
// import { Route, Routes, useLocation,RouterProps,RouteProps, Navigate } from "react-router-dom";


// interface RenderRouteProps extends CustomRoute {}

// const RenderRoute: React.FC<CustomRoute> = props => {
//     const { component } = props;
//     const Component: React.ComponentType<RenderRouteProps> = component!
//     return (
//         <Route path={} element={<ErrorBoundary><Component {...props} /></ErrorBoundary>} />
//     );
// };

const PrivateRoute = (props: PrivateRouteProps & { redirectPath?: RouteRedirectProps, animate?: boolean }) => {
    const location = useLocation();
    const { appRoutes, redirectPath } = props;
    // console.log({ appRoutes });

    return (
        <>
            <Suspense key={0} fallback={<FallbackLoader />}>
                <Routes >
                    {appRoutes && appRoutes.map((route, index) => (
                        <Route path={route?.path} element={<ErrorBoundary> <route.component /> </ErrorBoundary>} key={index} />
                    ))}

                    {redirectPath?.length && redirectPath.map((pah, index) => (
                        <Route path={pah?.from} element={<Navigate replace to={`${pah?.to}`} key={index} />} />
                        // path && <Navigate to={path.to} key={index} />
                    ))}
                </Routes>
            </Suspense>
        </>

    )
};

export default PrivateRoute;