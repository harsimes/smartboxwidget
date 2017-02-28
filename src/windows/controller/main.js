var {ipcRenderer, remote} = require('electron');
var app=angular.module('mainView', ['ngRoute', 'ngWebSocket', 'ngSanitize', 'ui.bootstrap']);
//var app=angular.module('mainView', ['ngRoute', 'ngWebSocket', 'ngSanitize']);

app.factory('DataStream', function($websocket) {
      // Open a WebSocket connection
      //var dataStream = $websocket('wss://smartsearchboxservice.mybluemix.net');
	  var context={};
	  var dataStream = $websocket('wss://smartbox1.mybluemix.net');
	  dataStream.onOpen(function(data){
		console.log("connection opened");
		return dataStream;
	  });
	  
	  dataStream.onClose(function(data){
		console.log("connection closed" + data);
		alert("connection closed");
	  });
	  
	  dataStream.onError(function(err){
		console.log("connection closed" +err);
		alert("Error");
	  });
		return dataStream;
    });




	app.config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when(
                    '/', {
                        templateUrl: 'watsonchat.html',
						controller: 'mainCtrl'
                    }
                );
				$routeProvider.when(
                    '/pingWatson', {
                        templateUrl: 'watson_chat_start.html',
						controller: 'chatCtrl'
                    }
                );
				$routeProvider.when(
                    '/dashboard', {
                        templateUrl: 'incidentReport.html',
						controller: 'incidentCtrl'
                    }
                );
                $routeProvider.otherwise({redirectTo: '/'});
            }
        ]
    );
	
	/** Main Controller start**/
	app.controller('mainCtrl', ['$scope', '$location', function($scope, $location) {
        
        //ipcRenderer.on('reload-insert-view', init);
		$scope.isActive = false;
		
		$scope.activeButton = function() {
			$scope.isActive = !$scope.isActive;
		}; 
		
		$scope.openWatsonChat=function(){
		ipcRenderer.send('resize', 375, 360);
		$location.path('/pingWatson');
		};
		
		$scope.opendashboard=function(){
		ipcRenderer.send('resize', 600, 475);
		$location.path('/dashboard');
		};
    }]);
	/** Main Controller end**/
		
		/** Chat Controller start**/
		app.controller( 'chatCtrl', [ '$scope', '$location','DataStream', function( $scope , $location, DataStream) {
		
		$scope.messages = [];
		//$scope.context={};
		DataStream.onMessage(function(message) {
		var response=JSON.parse(message.data);
		console.log("response "+ JSON.stringify(response));
		if(response.hasOwnProperty("count")){
		angular.forEach(response.result, function(item){
			//console.log("items "+item['Documentation with HTML']);
			if(response.type=='cloudant')
			{
				$scope.messages.push({"data" : item.incidentDesc, "user" : "Cloudant"});
			}
			else
			$scope.messages.push({"data" : item['Documentation with HTML'], "user" : "Watson"});
		});
        //$scope.messages.push({"data" : response.result['Documentation with HTML'], "user" : "Watson"});
		//console.log("docs "+response.result['Documentation with HTML']);
		}
		else
			$scope.messages.push({"data" : response.result, "user" : "Watson"});
			
			if(response.hasOwnProperty("context")){
				DataStream.context=response.context;
				//console.log("context "+ JSON.stringify(DataStream.context));
			};
			
		/**if(response.context!=undefined)
		{
		$scope.context=response.context;
		}**/
		
		
		$scope.send = function() {
				$scope.messages.push({"data" : $scope.textbox, "user" : "Honda"});
				var request={"input":{"text":$scope.textbox},"user":{},"context":DataStream.context};
				$scope.textbox="";
				DataStream.send(request).then(function(resp){
					console.log("watson request" +JSON.stringify(request));
				});
				
				
			};
	});		
	
	$scope.stopChat=function(){
		//ipcRenderer.send('resize', 375, 360);
		$location.path('/');
		};

			
		} ] );
		
		/** Chat Controller end**/
		
		/** Incident Controller start**/
		
		app.controller( 'incidentCtrl', [ '$scope', '$http', '$location', function( $scope, $http, $location) {
			var incident_url = "https://844d8c57-58b6-4391-8b52-50492bc81db2-bluemix.cloudant.com/cmdb/_all_docs?include_docs=true&limit=10"; 
			var params={'username':'844d8c57-58b6-4391-8b52-50492bc81db2-bluemix' , 'password':'acbb0d4c8c5a251db060d3890fc929afbb732c80ff7af948db5d4db512f327ea'};
			/**$http.get(incident_url,{'params': params, headers: {'Content-Type': 'application/json'}})
			.success(function(data){
			var data = data.rows ;
			$scope.data=data;
			})
			
			.error(function(error){
				
			});
			
			$scope.selectIncident= function(incident){
				$scope.selectedPersons.push(incident.id);
				
				
			
			}**/
			
			$scope.goBack=function(){
		//ipcRenderer.send('resize', 375, 360);
			$location.path('/');
		};
			
		} ] );
		
		/** Incident Controller end**/