import React, { Component } from 'react';
import { MDBCard, MDBCardBody, MDBContainer, MDBRow, MDBCol, Fa } from 'mdbreact';

class MyCard extends Component {
  render() {
    return (
        <MDBCard>                
            <MDBCardBody>
                <MDBContainer fluid>
                    <MDBRow>
                        <MDBCol>
                            <Fa icon={this.props.headerIcon} />
                        </MDBCol>
                        <MDBCol>
                            {this.props.text}
                        </MDBCol>
                    </MDBRow>
                    <hr></hr>
                    <MDBRow>
                        <MDBCol>
                        <Fa icon={this.props.footerIcon} /> {this.props.footerText}
                        </MDBCol>
                    </MDBRow>
                  </MDBContainer>                  
            </MDBCardBody>
        </MDBCard>
    );
  }
}

export default MyCard;
