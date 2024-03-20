// schema.ts
import * as Yup from 'yup';

export const TeamInitialValues = {
  username: '',
  contactnumber: '',
  password: '',
  email: '',
  color: '',
};

export const TeamValidationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  contactnumber: Yup.string().matches(/^\d+$/, 'Enter numbers only'),
  password: Yup.string().required('Password is required'),
  // email: Yup.string()
  //   .matches(
  //     /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  //     'Invalid email format'
  //   )
  //   .required('Email is required'),
});
