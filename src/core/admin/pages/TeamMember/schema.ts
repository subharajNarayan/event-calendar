import * as Yup from 'yup';

export const TeamInitialValues = {
  username: "",
  contactnumber: "",
  password: "",
  email: "",
  color: ""
};

export const validationSchema = Yup.object().shape({
  username: Yup.string().nullable().required('This field is required'),
  contactnumber: Yup.string().matches(/^\d+$/, 'Enter the number only'),
  password: Yup.mixed().nullable().required('This field is required'),
  email: Yup.string()
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Invalid email format'
    )
    .required('Email is required'),
  // email: Yup.string().email('Invalid email address')
  //   .test(
  //     'valid-email-at',
  //     'Email must contain "@"',
  //     (value) => {
  //       if (value) {
  //         return value.includes('@');
  //       }
  //       return false;
  //     }
  //   )
  //   .test(
  //     'valid-email-com',
  //     'Email must end with ".com"',
  //     (value) => {
  //       if (value) {
  //         return value.endsWith('.com');
  //       }
  //       return false;
  //     }
  //   )
  //   .test(
  //     'valid-email-com',
  //     'Email must end with ".com"',
  //     (value) => {
  //       if (value) {
  //         return value.endsWith('.com');
  //       }
  //       return false;
  //     }
  //   ),
})