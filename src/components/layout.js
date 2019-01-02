import React, { Component } from 'react';
import Header from './header';
import Footer from './footer';

class Layout extends Component {
  render() {
    return (
        <>
            <Header></Header>
            {this.props.children}
            <Footer></Footer>
        </>
    );
  }
}

export default Layout;
