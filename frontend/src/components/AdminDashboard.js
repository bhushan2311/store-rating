import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchDummyData();
  }, []);

  const fetchDummyData = () => {
    // Dummy data for stores
    const dummyStores = [
      { id: 1, name: 'Store One', email: 'storeone@example.com', address: '123 Main St', rating: 4.5 },
      { id: 2, name: 'Store Two', email: 'storetwo@example.com', address: '456 Maple Ave', rating: 3.7 },
    ];
    setStores(dummyStores);

    // Dummy data for users
    const dummyUsers = [
      { id: 1, name: 'Admin User', email: 'admin@example.com', address: 'Admin St', role: 'Admin' },
      { id: 2, name: 'Normal User', email: 'user@example.com', address: 'User St', role: 'User' },
      { id: 3, name: 'Store Owner', email: 'owner@example.com', address: 'Owner St', role: 'Store Owner', rating: 4.2 },
    ];
    setUsers(dummyUsers);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (roleFilter ? user.role === roleFilter : true)
  );

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const totalStores = stores.length;
  const totalRatings = users.filter(user => user.role === 'Store Owner').length;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <section>
        <h2>Statistics</h2>
        <p><strong>Total Users:</strong> {totalUsers}</p>
        <p><strong>Total Stores:</strong> {totalStores}</p>
        <p><strong>Total Users Submitted Rating:</strong> {totalRatings}</p>
      </section>
      <section>
        <h2>Add User</h2>
        <form>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input type="text" placeholder="Address" />
          <button type="submit">Add User</button>
        </form>
      </section>
      <section>
        <h2>Users</h2>
        <input
          type="text"
          placeholder="Search by name, email, or address"
          value={searchTerm}
          onChange={handleSearch}
        />
        <select value={roleFilter} onChange={handleRoleFilter}>
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
          <option value="Store Owner">Store Owner</option>
        </select>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
                <td>{user.role === 'Store Owner' ? user.rating : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2>Stores</h2>
        <input
          type="text"
          placeholder="Search by name, email, or address"
          value={searchTerm}
          onChange={handleSearch}
        />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map(store => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{store.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <button onClick={() => alert('Logged out')}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
