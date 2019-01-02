import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, Navbar } from 'mdbreact';

class Header extends Component {
  render() {
    return (
        <Navbar>
          <MDBContainer fluid>
            <MDBRow >
              <MDBCol size="12">            
                <img src="images/logo-currency1.png" className="img-fluid" alt="" />
              </MDBCol >
            </MDBRow>          
          </MDBContainer>
        </Navbar>
    );
  }
}

export default Header;
