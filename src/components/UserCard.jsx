// UserCard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserCard.css';
import email from "../assets/mail.png";
import phone from "../assets/telephone.png";
import website from "../assets/globe.png";
import edit from "../assets/edit.png";
import del from "../assets/delete.png";
import like from "../assets/heart.png";
import like2 from "../assets/love.png";

const UserCard = () => {
  const [userData, setUserData] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUserData, setEditedUserData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
  });
  const [likedUsers, setLikedUsers] = useState([]);

  useEffect(() => {
    // Fetch user data from API
    axios.get('https://6437ca24894c9029e8c6049c.mockapi.io/user')
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleEdit = (userId) => {
    // Open modal for editing user
    setEditUserId(userId);
    setIsModalOpen(true);
    const userToEdit = userData.find(user => user.id === userId);
    setEditedUserData({
      name: userToEdit.name,
      email: userToEdit.email,
      phone: userToEdit.phone,
      website: userToEdit.website,
    });
  };

  const handleCloseModal = () => {
    // Close modal and reset edited user data
    setIsModalOpen(false);
    setEditUserId(null);
    setEditedUserData({
      name: '',
      email: '',
      phone: '',
      website: '',
    });
  };

  const handleInputChange = (e) => {
    // Handle input changes in the modal form
    const { name, value } = e.target;
    setEditedUserData({
      ...editedUserData,
      [name]: value,
    });
  };

  const handleSaveChanges = () => {
    // Update user data locally and close modal
    setUserData(prevUserData => {
      return prevUserData.map(user => {
        if (user.id === editUserId) {
          return {
            ...user,
            name: editedUserData.name,
            email: editedUserData.email,
            phone: editedUserData.phone,
            website: editedUserData.website,
          };
        }
        return user;
      });
    });

    handleCloseModal();
  };

  const handleDelete = (userId) => {
    // Delete user locally
    setUserData(prevUserData => prevUserData.filter(user => user.id !== userId));
  };

  const handleLike = (userId) => {
    // Toggle liked status for the user
    setLikedUsers(prevLikedUsers => {
      if (prevLikedUsers.includes(userId)) {
        return prevLikedUsers.filter(id => id !== userId);
      } else {
        return [...prevLikedUsers, userId];
      }
    });
  };

  return (
    <div>
      <div className="user-cards-container">
        {userData.map(user => (
          <div className="user-card" key={user.id}>
            <div className='user-img'>
              <img src={user.avatar} alt={`Avatar of ${user.name}`} />
            </div>
            <hr className="horizontal-line-above-buttons" />
            <div className="user-info">
              <h2>{user.name}</h2>
              <div className="user-info-icons">
                <img className='user-icon' src={email} alt="email" />
                <p>Email: {user.email}</p>
              </div>
              <div className="user-info-icons">
                <img className='user-icon' src={phone} alt="" />
                <p>Phone: {user.phone}</p>
              </div>
              <div className="user-info-icons">
                <img className='user-icon' src={website} alt="" />
                <p>Website: {user.website}</p>
              </div>
              <div>
                <hr className="horizontal-line-above-buttons" />
                <div className="button-area">
                  <button onClick={() => handleLike(user.id)} className={likedUsers.includes(user.id) ? 'liked' : ''}>
                    <img style={{ width: "20px", height: "20px" }} src={likedUsers.includes(user.id) ? like : like2} alt='like' />
                  </button>
                  <div className="vertical-line"></div>
                  <button onClick={() => handleEdit(user.id)}>
                    <img style={{ width: "20px", height: "20px" }} src={edit} alt='edit' />
                  </button>
                  <div className="vertical-line"></div>
                  <button onClick={() => handleDelete(user.id)}>
                    <img style={{ width: "20px", height: "20px" }} src={del} alt='delete' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="horizontal-line"></div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Edit User</h2>
            <hr className="horizontal-line-above-buttons" />
            <form>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editedUserData.name}
                onChange={handleInputChange}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editedUserData.email}
                onChange={handleInputChange}
                required
              />
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={editedUserData.phone}
                onChange={handleInputChange}
              />
              <label>Website:</label>
              <input
                type="text"
                name="website"
                value={editedUserData.website}
                onChange={handleInputChange}
              />
              <hr className="horizontal-line-above-buttons" />
              <div className="button-area-modal">
                <button type="button" onClick={handleCloseModal}>Cancel</button>
                <button type="button" onClick={handleSaveChanges}>OK</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
