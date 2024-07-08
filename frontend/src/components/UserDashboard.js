import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { cleanLocalStorage, isAuthenticated } from "../auth/auth";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context";

// Styled Components
const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  flex: 1;
`;

const LogoutButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #dc3545;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const UserInfo = styled.div`
  text-align: left;
  margin-bottom: 20px;
  color: #333;
`;

const SearchInput = styled.input`
  display: block;
  width: 100%;
  padding: 10px;
  margin: 20px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHead = styled.thead`
  background-color: #f4f4f4;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 10px;
  text-align: center;

  &:first-child {
    text-align: left;
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newRating, setNewRating] = useState({});
  const [logout, setlogout] = useState(false);
  // const { userData } = useContext(AppContext);
  const [userData, setuserData] = ([JSON.parse(localStorage.getItem('userData'))]);

  const fetchStores = async () => {
    try {
      const response = await axios.get("http://localhost:5000/store", {
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("token")}`, // Replace with actual token
        },
      });

      const storesData = response.data;
      const currentUserId = localStorage.getItem("userId"); // Replace with actual current user ID

      const storesWithUserRatings = storesData.map((store) => {
        const userRatingObj = store.ratings.find(
          (rating) => rating.user._id === currentUserId
        );
        const userRating = userRatingObj ? userRatingObj.score : null;
        return { ...store, userRating };
      });

      setStores(storesWithUserRatings);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isValidRating = (rating) => rating >= 1 && rating <= 5;

  const handleRatingChange = (storeId, rating) => {
    if (isValidRating(rating)) {
      setNewRating((prevRatings) => ({ ...prevRatings, [storeId]: rating }));
    }
  };

  const submitRating = async (storeId) => {
    const rating = newRating[storeId];
    if (isValidRating(rating)) {
      console.log(rating);
      console.log("storeId ", storeId);
      try {
        const response = await axios.post(
          `http://localhost:5000/store/${storeId}/rate`,
          {
            score: rating,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": `${localStorage.getItem("token")}`, // Replace with actual token
            },
          }
        );
        console.log(response.data);
        fetchStores();
        alert(response.data.message);
      } catch (error) {
        console.error("Error submitting rating:", error);
      }
    } else {
      alert("Please enter a rating between 1 and 5.");
    }
  };

  const modifyRating = async (storeId) => {
    const rating = newRating[storeId];
    if (isValidRating(rating)) {
      try {
        const response = await axios.put(
          `http://localhost:5000/store/${storeId}/rate`,
          {
            score: rating,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": `${localStorage.getItem("token")}`, // Replace with actual token
            },
          }
        );
        // console.log(response.data);
        fetchStores();
        alert(response.data.message);
      } catch (error) {
        console.error("Error modifying rating:", error);
      }
    } else {
      console.log(rating);
      alert("Please add new rating");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return !isAuthenticated() ? (
    <Navigate to="/signin" />
  ) : (
    <DashboardContainer>
      <Header>
        <Title>User Dashboard</Title>
        <LogoutButton onClick={() => { cleanLocalStorage(); setlogout(true); }}>
          Logout
        </LogoutButton>
      </Header>
      <UserInfo>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Address:</strong> {userData.address}</p>
      </UserInfo>
      <SearchInput
        type="text"
        placeholder="Search by name or address"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Overall Ratings</TableCell>
            <TableCell>My Rating</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <tbody>
          {filteredStores.map((store) => (
            <TableRow key={store._id}>
              <TableCell>{store.name}</TableCell>
              <TableCell>{store.address}</TableCell>
              <TableCell>{store.overallRating}</TableCell>
              <TableCell>
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder={
                    store.userRating !== null
                      ? store.userRating.toString()
                      : "Rate now"
                  }
                  value={
                    newRating[store._id] !== undefined
                      ? newRating[store._id]
                      : store.userRating !== null
                      ? store.userRating
                      : ""
                  }
                  onChange={(e) =>
                    handleRatingChange(store._id, parseInt(e.target.value))
                  }
                />
              </TableCell>
              <TableCell>
                {store.userRating === null ? (
                  <Button onClick={() => submitRating(store._id)}>
                    Submit Rating
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => modifyRating(store._id)}>
                      Modify Rating
                    </Button>
                    {/* <Button onClick={() => submitRating(store._id)}>
                      Submit Rating
                    </Button> */}
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </DashboardContainer>
  );
};

export default UserDashboard;
