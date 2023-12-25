import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import './pagination.scss';
import { Table } from 'reactstrap';
import axios from 'axios';

interface Data {
  id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  address: string;
  email: string;
  message: string;
}

const Pagination = () => {

  const [initialState, setInitialState] = useState<any[]>([])

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    try {
      axios.get('http://localhost:5000/api/register')
      .then((response) => {
        setInitialState(response.data)
      })
    } catch (error) {
      console.log(error);
      
    }
  })

  const itemsPerPage = 5;
  const pageCount = Math.ceil(initialState.length / itemsPerPage);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const currentItems = initialState.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section className="table-with-pagination p-4 list data-table">
      <div className='pagination-heading'>
        <h4>REACT PAGINATE</h4>
      </div>
      <div className='table-responsive'>
        <Table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Email</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td>{item._id}</td>
                <td>{item.firstname}</td>
                <td>{item.middlename}</td>
                <td>{item.lastname}</td>
                <td>{item.address}</td>
                <td>{item.email}</td>
                <td>{item.message}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageChange}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </section>
  );
};

export default Pagination;
