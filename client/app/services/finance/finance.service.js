'use strict';
const angular = require('angular');

/*@ngInject*/
export function financeService($http) {
	// AngularJS will instantiate a singleton by calling "new" on this function
    // for each symbol.name make a yahoo query for financial data
    // https://developer.yahoo.com/yql/console
      
    // https://developer.yahoo.com/yql/console
	// request data to yahoo
	return {
		getData: function(names=['']){
			if(!names.length){
				return Promise.resolve([]);
			}

		var url1= "https://query.yahooapis.com/v1/public/yql?q=",
			  select="select * from yahoo.finance.historicaldata where symbol IN ("+names.join(",")+")",
			  curdate= moment(),
			  endDate= curdate.format('YYYY-MM-DD'),
			  startDate= curdate.subtract(1, 'months').format('YYYY-MM-DD') ,
			  url2=encodeURIComponent(select+" and startDate = '"+startDate+"' and endDate = '"+endDate+"'"),
			  url3="&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"; //&callback=";
			var queryStr = url1+url2+url3;

			return $http.get(queryStr);
		}
	}

}

export default angular.module('stockmarketApp.finance', [])
  .service('finance', financeService)
  .name;
