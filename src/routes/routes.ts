import { lazy } from 'react';
const Login = lazy(() => import("../core/public/login/login"))

// const Dashboard = lazy(() => import("../core/protected/Dashboard/dashboard"))
const Signup = lazy(() => import("../core/public/signup/signup"))

// PROTECTED
const Home = lazy(() => import("../core/public/Home/Home"))
const ProtectedHome = lazy(() => import("../core/protected/pages/Home/Home"));
const About = lazy(() => import("../core/public/About/About"))
// const Form = lazy(() => import("../core/protected/pages/form/Form"))
// const ModalFormList = lazy(() => import("../core/protected/pages/list/index"))
const Pagination = lazy(() => import("../core/protected/pages/pagination/Pagination"))
// const Checkbox = lazy(() => import("../core/protected/pages/checkbox/Checkbox"))
// const Carousel = lazy(() => import('../core/protected/pages/carousel/Carousel'))

// ADMIN
// const AdminHome = lazy(() => import("../core/public/Home/Home"))
const AdminHome = lazy(() => import("../core/admin/pages/Home/Home"));
// const AdminAbout = lazy(() => import("../core/public/About/About"))
// const AdminForm = lazy(() => import("../core/admin/pages/form/Form"))
const AdminModalFormList = lazy(() => import("../core/admin/pages/list/index"))
const AdminPagination = lazy(() => import("../core/admin/pages/pagination/Pagination"))
// const AdminCheckbox = lazy(() => import("../core/admin/pages/checkbox/Checkbox"))
// const AdminCarousel = lazy(() => import('../core/admin/pages/carousel/Carousel'))

const appRoutes: CustomRoute[] = [
    {
        path: "/login",
        component: Login,
        type: "login"
    },
    {
        path: "/auth/no",
        component: Home,
        type: "authorized",
    },
    {
        path: "/auth/home",
        component: ProtectedHome,
        type: "authorized",
    },
    {
        path: "/auth/about",
        component: About,
        type: "authorized",
    },
    // {
    //     path: "/auth/form",
    //     component: Form,
    //     type: "authorized",
    // },
    // {
    //     path: "/auth/list",
    //     component: ModalFormList,
    //     type: "authorized",
    // },
    {
        path: "/auth/pagination",
        component: Pagination,
        type: "authorized",
    },
    // {
    //     path: "/auth/checkbox",
    //     component: Checkbox,
    //     type: "authorized",
    // },
    // {
    //     path: "/auth/carousel",
    //     component: Carousel,
    //     type: "authorized",
    // },

    // ADMINPANEL

    {
        path: "/admin/home",
        component: AdminHome,
        type: "authorized",
    },
    // {
    //     path: "/admin/about",
    //     component: AdminAbout,
    //     type: "authorized",
    // },
    // {
    //     path: "/admin/form",
    //     component: AdminForm,
    //     type: "authorized",
    // },
    {
        path: "/admin/list",
        component: AdminModalFormList,
        type: "authorized",
    },
    {
        path: "/admin/pagination",
        component: AdminPagination,
        type: "authorized",
    },
    // {
    //     path: "/admin/checkbox",
    //     component: AdminCheckbox,
    //     type: "authorized",
    // },
    // {
    //     path: "/admin/carousel",
    //     component: AdminCarousel,
    //     type: "authorized",
    // },


    {
        path: "/signup",
        component: Signup,
        type: "signup"
    }
]

export default appRoutes
