import * as Yup from 'yup';

export const taskInitialValues = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  assigned_user_name:"",
  task_complete: false,
  status: "active",
  location: ""
};

export const taskValidationSchema = Yup.object().shape({
  
})