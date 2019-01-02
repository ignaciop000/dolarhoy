import React, { Component } from 'react';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import Layout from './components/layout.js';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody  } from 'mdbreact';
import BarChart from './components/barChart';
import MyCard from './components/myCard';
import * as d3 from 'd3';

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

class App extends Component {
  state = {
    data: [12, 5, 6, 6, 9, 10],
    width: 700,
    height: 500,
    id:'root'    
  }

	componentDidMount() {
    var widthinner = window.innerWidth - 100;
    var heightinner = window.innerHeight;
    let parseTime = d3.timeParse("%d-%m-%y");

    const margin = { top: 20, right: 20, bottom: 130, left: 50 };
    const width = widthinner - margin.left - margin.right;
    const height = heightinner - margin.top - margin.bottom;

    var x = d3.scaleBand()
      .range([0, width])
      .paddingInner(0.1); // space between bars (it's a ratio)

    var y = d3.scaleLinear().range([height, 0]);

    var yAxis = d3.axisLeft(y)
      .ticks(10);

    const svg = d3.select('#dolar-graphic')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

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

          var cotizaciones_este_ano = [];
          var cotizaciones_este_mes = []; 

          response.forEach(function(d) {
            d.dia = parseTime(d.dia[0]);
            d.cotizacion_compra = +d.cotizacion_compra;
            d.cotizacion_venta = +d.cotizacion_venta;
        
        
            if (d.dia.getFullYear() === new Date().getFullYear()) {
                cotizaciones_este_ano.push(d.cotizacion_venta);
            }
        
            if (d.dia.getMonth()+1 === new Date().getMonth()+1 && d.dia.getFullYear() === new Date().getFullYear()) {
                cotizaciones_este_mes.push(d.cotizacion_venta);
            }    
        
          });

          x.domain(response.map(function(d) { return d.dia; }));
          y.domain([0, d3.max(response, function(d) { return d.cotizacion_venta; })]);

          const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

          svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,'+height+')')
            .call(d3.axisBottom(x)
              .tickFormat(d3.timeFormat("%Y")))
            .selectAll("text")
              .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", ".15em")
              .attr("transform", "rotate(-90)" );

          svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
              .attr('transform', 'rotate(-90)')
              .attr('y', 6)
              .attr('dy', '.71em')
              .style('text-anchor', 'end')

          svg.selectAll('.bar')
            .data(response)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) { return x(d.dia); })
            .attr('width', x.bandwidth())
            .attr("y", function(d) { return y(d.cotizacion_venta); })
            .attr("height", function(d) { return height - y(d.cotizacion_venta); })
            .on('mouseover', (d) => {
              tooltip.transition().duration(50).style('opacity', 0.9);
              tooltip.html('Dia: <span>' + d.dia + '</span><br>'+
                'Precio: <span>'+d.cotizacion_venta+'</span>')
                  //.style('left', +d3.event.layerX+'px')
                  //.style('top', +event.clientY-50+'px')
                  .style('height', 40+'px');
              })
            .on('mouseout', () => tooltip.transition().style('opacity', 0));

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
                    <MDBCardBody><div id="dolar-graphic"></div></MDBCardBody>
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
