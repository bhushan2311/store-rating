import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context";
import axios from "axios";

const Container = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const Section = styled.section`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const LogoutButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  float: right;

  &:hover {
    background-color: #0056b3;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }
`;

const StoreOwnerDashboard = () => {
  const [averageRating, setAverageRating] = useState(0);
  const navigate = useNavigate();
  // const {storeOwnerData} = useContext(AppContext);
  const [storeOwnerData, setStoreOwnerData] = ([JSON.parse(localStorage.getItem('storeOwnerData'))]);

  useEffect(() => {
    // console.log("log-",storeOwnerData);
  }, [storeOwnerData]);

  const handleLogout = () => {
    // localStorage.removeItem("token");
    // localStorage.removeItem("userId");
    localStorage.clear();
    navigate("/signin");
  };

  return (
    storeOwnerData? <Container>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      <Title>Store Owner Dashboard</Title>
      <Section>
        <h2>Store Details</h2>
        <p>
          <strong>Name:</strong> {storeOwnerData.name}
        </p>
        <p>
          <strong>Email:</strong> {storeOwnerData.email}
        </p>
        <p>
          <strong>Address:</strong> {storeOwnerData.address}
        </p>
        <p>
          <strong>Average Rating:</strong> {storeOwnerData.overallRating}
        </p>
      </Section>
      <Section>
        <h2>Ratings</h2>
        <Table>
          <thead>
            <tr>
              <th>User</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {storeOwnerData.ratings &&
              storeOwnerData.ratings.map((rating, index) => (
                <tr key={index}>
                  <td>{rating.user.name}</td>
                  <td>{rating.score}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Section>
    </Container>:"Please wait....."
  );
};

export default StoreOwnerDashboard;
