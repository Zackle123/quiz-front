import React from 'react';
import { NavLink } from 'react-router-dom';


export default function Navbar() {
  const navStyle = {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    justifyContent: 'center',
  };

  const linkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    color: isActive ? '#ffd700' : 'white',
    fontWeight: isActive ? 'bold' : 'normal',
    borderBottom: isActive ? '2px solid #ffd700' : 'none',
    paddingBottom: '2px'
  });

  return (
    <nav style={navStyle}>
      <NavLink to="/" style={linkStyle} end>
        Quiz
      </NavLink>
      <NavLink to="/about" style={linkStyle}>
        About Us
      </NavLink>
      <NavLink to="/contact" style={linkStyle}>
        Contact
      </NavLink>
            <NavLink to="/add" style={linkStyle}>
        Add
      </NavLink>
    </nav>
  );
}
