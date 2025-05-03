import React, { useContext } from 'react';
import styled from 'styled-components';
import HeaderWithDate from '../components/HeaderWithDate';
import AuthStatus from '../components/AuthStatus';
import { AuthContext } from '../App';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProfileCard = styled.div`
  background-color: var(--off-white);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--blush-pink);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 1.5rem;
  color: var(--deep-rose-red);
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h3`
  font-size: 1.2rem;
  color: var(--deep-rose-red);
  margin-bottom: 5px;
`;

const ProfileEmail = styled.p`
  font-size: 0.9rem;
  color: var(--dark-maroon);
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--blush-pink);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.span`
  font-size: 1rem;
  color: var(--dark-maroon);
`;

const ProfileScreen = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  
  // Get the first letter of the email for the avatar
  const avatarLetter = user?.email ? user.email[0].toUpperCase() : '?';
  
  return (
    <ProfileContainer>
      <HeaderWithDate title="Profile & Settings" />
      <AuthStatus isAuthenticated={isAuthenticated} onLogout={logout} />
      <ProfileCard>
        <ProfileHeader>
          <ProfileAvatar>{avatarLetter}</ProfileAvatar>
          <ProfileInfo>
            <ProfileName>User Profile</ProfileName>
            <ProfileEmail>{user?.email || 'No email available'}</ProfileEmail>
          </ProfileInfo>
        </ProfileHeader>
        
        <SettingItem>
          <SettingLabel>Notifications</SettingLabel>
          <span>On</span>
        </SettingItem>
        <SettingItem>
          <SettingLabel>Dark Mode</SettingLabel>
          <span>Off</span>
        </SettingItem>
        <SettingItem>
          <SettingLabel>Language</SettingLabel>
          <span>English</span>
        </SettingItem>
        <SettingItem>
          <SettingLabel>Privacy Settings</SettingLabel>
          <span>→</span>
        </SettingItem>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default ProfileScreen;