import axios from 'axios';
import React from 'react';
import { Table } from 'reactstrap';
import { DeleteIcon } from '../../../../assets/images/xd';
import { toast } from 'react-toastify';
import './list.scss'

const List = () => {

  const [Data, isSetData] = React.useState<any[]>([]);

  React.useEffect(() => {
    axios.get('http://localhost:5000/api/register')
      .then((response) => {
        isSetData(response.data)
      })
      .catch(error => {
        console.log(error);
      });
  }, [])


  const handleDelete = async (_id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/register/${_id}`);
      toast.success('Data Deleted Successful')
      const response = await axios.get('http://localhost:5000/api/register');
      const deleteData = response.data;
      isSetData(deleteData)
      console.log({deleteData});
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <section className="list data-table mt-4">
      <div className='table-responsive'>
        <Table className='table'>
          <thead>
            <tr>
              {/* <th>S.N</th> */}
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Email</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Data.map((item, index) => (
              <tr key={index}>
                {/* <td>{item._id}</td> */}
                <td>{item.firstname}</td>
                <td>{item.middlename}</td>
                <td>{item.lastname}</td>
                <td>{item.address}</td>
                <td>{item.email}</td>
                <td>{item.message}</td>
                <td className='action-btn' onClick={() => handleDelete(item._id)}>
                  <img src={DeleteIcon} alt="" className='mr-0'/>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </section>
  )
}

export default List;