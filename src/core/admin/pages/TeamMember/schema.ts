// schema.ts
import * as Yup from 'yup';

export const TeamInitialValues = {
  username: '',
  contactnumber: '',
  password: '',
  email: '',
  color: '',
};

export const isUsernameUnique = async (username: string) => {
  // Add your logic to check if the username is unique on the client side
  // This could involve checking against a list of existing usernames or any other client-side logic

  // For example, check against an array of existing usernames
  const existingUsernames = ['Demo', 'serish', 'test'];

  return !existingUsernames.includes(username);
};

export const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .test('unique-username', 'Username already exists', async function (value) {
      if (!value) return true; // Skip validation if the field is empty

      try {
        const isUnique = await isUsernameUnique(value);
        return isUnique;
      } catch (error) {
        console.error('Error checking username existence:', error);
        return false; // Return false if there's an error (you can handle it accordingly)
      }
    }),
  contactnumber: Yup.string().matches(/^\d+$/, 'Enter numbers only'),
  password: Yup.string().required('Password is required'),
  email: Yup.string()
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Invalid email format'
    )
    .required('Email is required'),
});
