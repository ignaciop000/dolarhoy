import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, Fa, NavbarNav, NavItem, NavLink } from 'mdbreact';

class Footer extends Component {
  render() {
    return (
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol size="6">            
                <NavbarNav right>
                  <NavItem>

                  </NavItem>
                  <NavItem>

                  </NavItem>
                </NavbarNav> 
            </MDBCol >
            <MDBCol size="6">
                &copy; {new Date().getFullYear()} Copyright:{" "} <a href="#"> IEP </a>
            </MDBCol>
          </MDBRow>          
        </MDBContainer>
    );
  }
}

export default Footer;