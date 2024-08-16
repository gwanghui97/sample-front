import React from 'react'
import logo from '../assets/logo.png'
import { Container } from 'react-bootstrap'
import { Link, NavLink, Outlet } from 'react-router-dom'
import styled from 'styled-components'

const AppLayout = () => {
    return (
      <>
        <StyledNavbar>
          <NavbarContainer>
            <Link to="/">
              <Logo src={logo} alt="Logo" />
            </Link>
            <NavLinks>
              <StyledNavLink to="/boards/R">매칭 후기</StyledNavLink>
              <StyledNavLink to="/boards/B">자랑</StyledNavLink>
              <StyledNavLink to="/boards/A">공지사항</StyledNavLink>
              <StyledNavLink to="/boards/I">신고/문의</StyledNavLink>
            </NavLinks>
            <LoginButton to="/login">로그인</LoginButton>
          </NavbarContainer>
        </StyledNavbar>
        <Outlet />
      </>
    )
  }

const StyledNavbar = styled.nav`
  background-color: white;
  padding: 10px 0;
`

const NavbarContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled.img`
  height: 50px;
`

const NavLinks = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`

const StyledNavLink = styled(NavLink)`
  color: black;
  text-decoration: none;
  margin: 0 30px;
  font-weight: bold;
`

const LoginButton = styled(NavLink)`
  background-color: #007bff;
  border-color: #007bff;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #0056b3;
    border-color: #0056b3;
    color: white;
  }

  &.active {
    background-color: #007bff;
    border-color: #007bff;
  }
`

export default AppLayout