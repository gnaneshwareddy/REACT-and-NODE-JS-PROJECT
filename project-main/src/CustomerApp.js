import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CustomerTable.css";

const CustomerTable = () => {
  const [data, setData] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [sortType, setSortType] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/customers");
      console.log('got')
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(nameSearch.toLowerCase()) &&
      item.location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const sortedData = filteredData.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    if (sortType === "date") {
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }
  });

  // Pagination Logic
  const pageSize = 20;
  const pageCount = Math.ceil(sortedData.length / pageSize);

  const handlePageClick = (index) => {
    setCurrentPage(index);
  };

  const displayData = sortedData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="customer-table-container">
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by Name"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Location"
          value={locationSearch}
          onChange={(e) => setLocationSearch(e.target.value)}
        />
        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="time">Sort by Time</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <table className="customer-table">
        <thead>
          <tr>
            <th>Sno</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((item) => (
            <tr key={item.sno}>
              <td>{item.sno}</td>
              <td>{item.name}</td>
              <td>{item.age}</td>
              <td>{item.phone}</td>
              <td>{item.location}</td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
              <td>{new Date(item.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: pageCount }).map((_, index) => (
          <button
            key={index}
            className={currentPage === index ? "active" : ""}
            onClick={() => handlePageClick(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomerTable;
