import React, { Component } from 'react';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import Layout from './components/layout.js';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody  } from 'mdbreact';
import BarChart from './components/barChart';
import MyCard from './components/myCard';

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

class App extends Component {
  state = {
    data: [12, 5, 6, 6, 9, 10],
    width: 700,
    height: 500,
    id:'root'    
  }

	componentWillMount() {
    fetch('/cotizaciones/dolar.json')
        .then(response => response.json())
        .then(response => {
          let dia = response.map(function(d) { return d.dia; }).reverse()[0][0];
          let dia_anterior = response.map(function(d) { return d.dia; }).reverse()[1][0];
          let compra = response.map(function(d) { return d.cotizacion_compra; }).reverse()[0][0]; 
          let compra_anterior = response.map(function(d) { return d.cotizacion_compra; }).reverse()[1][0];
          let venta = response.map(function(d) { return d.cotizacion_venta; }).reverse()[0][0];
          let venta_anterior = response.map(function(d) { return d.cotizacion_venta; }).reverse()[1][0];
          let porcentaje = (((venta - venta_anterior)/venta_anterior)*100).toFixed(2);
          let diferenciaDiaria = "";
          let porcentajeColor = "";
          if ((porcentaje)>0.00) {
            diferenciaDiaria = "arrow-up";
            porcentajeColor = "green";
          } else if ((porcentaje) === 0.00){
            diferenciaDiaria = "arrows-horizontal";
            porcentajeColor = "black";        
          } else {
            diferenciaDiaria = "arrow-down";
            porcentajeColor = "red";    
          }

          this.setState ({
            dia,
            dia_anterior,
            compra,
            compra_anterior,
            venta,
            venta_anterior,
            porcentaje,
            diferenciaDiaria,
            porcentajeColor,
          });
        })  
        .catch( error => {
            console.log("error", error);            
        });
  }


  render() {
    return (
      <Layout>
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol lg="3" sm="12">
              <MyCard footerText="La cotización todos los días." footerIcon="refresh" headerIcon="calendar" text={"Fecha " + this.state.dia}></MyCard>
            </MDBCol >
            <MDBCol  lg="3" sm="12">
              <MyCard footerText={"Última actualización: " + this.state.dia} footerIcon="calendar" headerIcon="sort" text={"Compra " + this.state.compra}></MyCard>             
            </MDBCol >
            <MDBCol  lg="3" sm="12">
              <MyCard footerText={"Última actualización: " + this.state.dia} footerIcon="calendar" headerIcon="sort" text={"Venta " + this.state.venta}></MyCard>             
            </MDBCol >
            <MDBCol  lg="3" sm="12">
              <MyCard footerText="Descarga los últimos 10 años." footerIcon="refresh" headerIcon="arrow-circle-o-down" text="Listado Completo Click Aqui"></MyCard>             
            </MDBCol >                          
          </MDBRow>
              <MDBRow>
                <MDBCol md="12">
                  <MDBCard>
                    <MDBCardBody><div id="barchart"></div></MDBCardBody>
                  </MDBCard>
                  <BarChart data={this.state.data} width={this.state.width} height={this.state.height} />
                </MDBCol >
              </MDBRow>
          <MDBRow>
            <MDBCol  lg="6" sm="12">
              <MyCard footerText={"Acumulado en "+new Date().getFullYear()} footerIcon="calendar" headerIcon="" text={"Acumulado Anual"}></MyCard>
            </MDBCol >
            <MDBCol  lg="3" sm="12">
              <MyCard footerText={"Acumulado en "+monthNames[new Date().getMonth()]} footerIcon="calendar" headerIcon="" text={"Acumulado mensual"+this.state.porcentaje_mes+"%"}></MyCard>
            </MDBCol >
            <MDBCol  lg="3" sm="12">
              <MyCard footerText={"Cotización de hace una hora"} footerIcon="calendar" headerIcon="" text={"Última actualización"+this.state.porcentaje+"%"}></MyCard>
            </MDBCol >    
          </MDBRow>
        </MDBContainer>       
      </Layout>      
    );
  }
}

export default App;
