import React from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--off-white);
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const NavItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  color: ${props => props.active ? 'var(--deep-rose-red)' : 'var(--dark-maroon)'};
  opacity: ${props => props.active ? 1 : 0.7};
  font-size: 0.7rem;
  font-weight: ${props => props.active ? 600 : 400};
  
  svg {
    margin-bottom: 4px;
    width: 24px;
    height: 24px;
  }
  
  &:hover {
    color: var(--deep-rose-red);
  }
`;

// Icons
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const JournalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2v6a2 2 0 002 2h6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 13h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 17h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Navigation = ({ activeTab, onTabChange }) => {
  return (
    <NavContainer>
      <NavItem 
        active={activeTab === 'home'} 
        onClick={() => onTabChange('home')}
      >
        <HomeIcon />
        <span>Home</span>
      </NavItem>
      
      <NavItem 
        active={activeTab === 'camera'} 
        onClick={() => onTabChange('camera')}
      >
        <CameraIcon />
        <span>Capture</span>
      </NavItem>
      
      <NavItem 
        active={activeTab === 'journal'} 
        onClick={() => onTabChange('journal')}
      >
        <JournalIcon />
        <span>Journal</span>
      </NavItem>
      
      <NavItem 
        active={activeTab === 'profile'} 
        onClick={() => onTabChange('profile')}
      >
        <ProfileIcon />
        <span>Profile</span>
      </NavItem>
    </NavContainer>
  );
};

export default Navigation;