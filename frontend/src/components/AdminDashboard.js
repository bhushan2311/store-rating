import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem 9rem;
  position: relative;
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #ff4b4b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ff1f1f;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
`;

const Statistics = styled.p`
  font-size: 18px;
  margin: 5px 0;

  strong {
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;

  input,
  select,
  button {
    padding: 10px;
    font-size: 16px;
  }

  button {
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #45a049;
    }
  }
`;

const Input = styled.input`
  border: 1px solid #ccc;
  border-radius: 5px;
  flex: 1;
`;

const Select = styled.select`
  border: 1px solid #ccc;
  border-radius: 5px;
  flex: 1;
`;

const SearchInput = styled(Input)`
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #f1f1f1;
  }
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;

  label {
    margin-right: 10px;
  }

  select {
    margin: 0 5px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
`;

const AdminDashboard = () => {
  const [addData, setAddData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "normal", // default role
  });
  const [stores, setStores] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [storeSearchTerm, setStoreSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [userSortKey, setUserSortKey] = useState("");
  const [userSortOrder, setUserSortOrder] = useState("");
  const [storeSortKey, setStoreSortKey] = useState("");
  const [storeSortOrder, setStoreSortOrder] = useState("");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:5000/admin", {
      headers: {
        "Content-Type": "application/json",
        "auth-token": `${localStorage.getItem("token")}`,
      },
    });

    const allData = response.data;
    console.log(allData);
    setUsers(allData);
  };

  const handleSearch = (e, setSearchTerm) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
  };

  const applySort = (data, sortKey, sortOrder) => {
    const sortedData = [...data];
    if (sortKey) {
      sortedData.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortedData;
  };

  const filteredUsers = applySort(
    users.filter(
      (user) =>
        (user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.address.toLowerCase().includes(userSearchTerm.toLowerCase())) &&
        (roleFilter ? user.role === roleFilter : true)
    ),
    userSortKey,
    userSortOrder
  );

  const filteredStores = applySort(
    users.filter(
      (user) =>
        user.role === "storeOwner" &&
        (user.name.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
          user.address.toLowerCase().includes(storeSearchTerm.toLowerCase()))
    ),
    storeSortKey,
    storeSortOrder
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url =
        addData.role === "normal" || addData.role === "admin"
          ? "http://localhost:5000/auth/signup"
          : "http://localhost:5000/store/auth";
      const response = await axios.post(url, addData);
      alert(response.data.message);
    } catch (error) {
      console.error("Error signing up", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const totalUsers = users.length;
  const totalStores = users.filter((user) => user.role === "storeOwner").length;
  const totalRatings = users.filter((user) => user.role === "normal").length;

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container>
      <LogoutButton onClick={() => {localStorage.clear(); navigate("/signin")}}>Logout</LogoutButton>
      <Title>Admin Dashboard</Title>
      <Section>
        <SectionTitle>Statistics</SectionTitle>
        <Statistics>
          <strong>Total Users:</strong> {totalUsers}
        </Statistics>
        <Statistics>
          <strong>Total Stores:</strong> {totalStores}
        </Statistics>
        <Statistics>
          <strong>Total Users Submitted Rating:</strong> {totalRatings}
        </Statistics>
      </Section>
      <Section>
        <SectionTitle>Add User</SectionTitle>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Name"
            name="name"
            value={addData.name}
            onChange={handleInputChange}
          />
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={addData.email}
            onChange={handleInputChange}
          />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            value={addData.password}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            placeholder="Address"
            name="address"
            value={addData.address}
            onChange={handleInputChange}
          />
          <Select name="role" value={addData.role} onChange={handleInputChange}>
            <option value="normal">User</option>
            <option value="storeOwner">Store Owner</option>
            <option value="admin">Admin</option>
          </Select>
          <button type="submit">Add User</button>
        </Form>
      </Section>
      <Section>
        <SectionTitle>Users</SectionTitle>
        <FilterBar>
          <SearchInput
            type="text"
            placeholder="Search by name, email, or address"
            value={userSearchTerm}
            onChange={(e) => handleSearch(e, setUserSearchTerm)}
          />
          <Select value={roleFilter} onChange={handleRoleFilter}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="storeOwner">Store Owner</option>
          </Select>
        </FilterBar>
        <SortContainer>
          <label>Sort by: </label>
          <Select value={userSortKey} onChange={(e) => setUserSortKey(e.target.value)}>
            <option value="">None</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
          </Select>
          <Select value={userSortOrder} onChange={(e) => setUserSortOrder(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
        </SortContainer>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
                {/* <td>
                  {user.role === "storeOwner" ? user.overallRating : "N/A"}
                </td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
      <Section>
        <SectionTitle>Stores</SectionTitle>
        <FilterBar>
          <SearchInput
            type="text"
            placeholder="Search by name, email, or address"
            value={storeSearchTerm}
            onChange={(e) => handleSearch(e, setStoreSearchTerm)}
          />
        </FilterBar>
        <SortContainer>
          <label>Sort by: </label>
          <Select value={storeSortKey} onChange={(e) => setStoreSortKey(e.target.value)}>
            <option value="">None</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
          </Select>
          <Select value={storeSortOrder} onChange={(e) => setStoreSortOrder(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
        </SortContainer>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Ratings</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map((filteredUser, index) => (
              <tr key={index}>
                <td>{filteredUser.name}</td>
                <td>{filteredUser.email}</td>
                <td>{filteredUser.address}</td>
                <td>{filteredUser.overallRating}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
};

export default AdminDashboard;
