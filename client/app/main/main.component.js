import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './main.routes';

export class MainController {
  // awesomeThings = [];
  // newThing = '';
  names = ['MSFT', 'AAPL', 'GOOG'];
  chartConfig={
          rangeSelector: {
              selected: 1
          },

          yAxis: {
              labels: {
                  formatter: function () {
                      return (this.value > 0 ? ' + ' : '') + this.value + '%';
                  }
              },
              plotLines: [{
                  value: 0,
                  width: 2,
                  color: 'silver'
              }]
          },

          plotOptions: {
              series: {
                  compare: 'percent'
              }
          },

          tooltip: {
              pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
              valueDecimals: 2
          },
          series: []
      };


  /*@ngInject*/
  constructor($http, $scope, $timeout, socket, finance) {
    this.$http = $http;
    this.socket = socket;
    this.FinanceData = finance;
    this.$timeout = $timeout;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('symbol');
    });
  }

  $onInit() {
    // this.$http.get('/api/things')
    //   .then(response => {
    //     this.awesomeThings = response.data;
    //     this.socket.syncUpdates('thing', this.awesomeThings);
    //   });

    this.symbols = [];
    this.newSymbol = '';

    this.$http.get('/api/symbols')
      .then(symbols => {
        //console.log("symbols", symbols);
        this.symbols = symbols.data;
        // fill highchart data
        this.names = this.symbols.map(function(symbol){
          return '"'+symbol.name+'"';
        });

        // refresh chart data
        this.$timeout(()=>{
          this.updateChart(this.names);
        },100);

        this.socket.syncUpdates('symbol', this.symbols, (event, item, array)=> {
          this.names = this.symbols.map(function(symbol){
            return '"'+symbol.name+'"';
          });
          this.updateChart(this.names);
        });
      });
  }

   addSymbol() {
      if(this.newSymbol) {
        this.$http.post('/api/symbols', { 
          name: this.newSymbol.toUpperCase() 
        });
        this.newSymbol = '';
      }
    };

    deleteSymbol(symbol) {
      this.$http.delete(`/api/symbols/${symbol._id}`);
    };





/// highchart

    updateChart(names){
      // for each symbol.name make a yahoo query for financial data
      var seriesOptions = [];

      this.FinanceData.getData(names)
        .then((historicaldata)=> {
            // fill data array
            // reformat data
            
            //console.log("hist",historicaldata);
            var collectData={};
            historicaldata.data.query.results.quote.forEach(function(data){
              // if object dont exist.. create/initialize as empty array
              if(!collectData[data.Symbol]) {
                collectData[data.Symbol]=[];
              }
              collectData[data.Symbol].push([Date.parse(data["Date"]),parseFloat(data.Open)]);
            });

            Object.keys(collectData).forEach(function(symbol){
              // data must be ascending, on X (date)
              seriesOptions.push( { name: symbol, data:collectData[symbol].sort(function(a,b){return a[0]-b[0];}) });
            });

            // create/display chart
            //console.log(seriesOptions);

            //this.createChart(seriesOptions);
            this.chartConfig.series= seriesOptions;
      });

    } // fin updateChart
}

export default angular.module('stockmarketApp.main', [ngRoute])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
