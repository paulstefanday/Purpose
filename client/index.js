var io = require('socket.io-client'),
    angular = require('angular'),
    name = 'app';

require('angular-socket-io');
require('angular-ui-router');
require('angular-animate');
require('satellizer');
require('sweetalert');
require('angular-sweetalert');
require('ladda-angular');
require('ngmap');
require('ng-flat-datepicker');

// App
angular.module(name, [
	'satellizer',
	'btford.socket-io',
	'ui.router',
	'ngAnimate',
	'oitozero.ngSweetAlert',
	'ladda',
	'ngMap',
  'ngFlatDatepicker'
])
  .config(require('./config'))
  .run(require('./global'))
  .constant('Categories', ['Policy & research', 'Education', 'Social Work', 'Administration', 'Project Management', 'PR', 'Campaigning', 'Fundraising', 'Legal', 'Human Resoruces', 'Finance', 'Technoloy', 'Design', 'International Development', 'Business Development'])
  .constant('Issues', ['Social Work', 'Education', 'Environment', 'International Aid', 'Mental Health', 'Diversity', 'Drug & alcohol'])


// App Parts
require('./bootstrap')(name)
	.directive(...require('./directives/map'))
  	.directive(...require('./directives/nav'))
	.factory('socket', /*@ngInject*/ function(socketFactory) {
		return socketFactory({ prefix: '', ioSocket: io.connect('http://localhost:3000/') })
	})
	.directive('fileModel', ['$parse', function ($parse) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            var model = $parse(attrs.fileModel);
	            var modelSetter = model.assign;

	            element.bind('change', function(){
	                scope.$apply(function(){
	                    modelSetter(scope, element[0].files[0]);
	                });
	            });
	        }
	    };
	}])
	.service('fileUpload', /*@ngInject*/ function ($http, $q) {
	    this.uploadFileToUrl = function(file, uploadUrl){
	    	var q = $q.defer();

	        var fd = new FormData();
	        fd.append('file', file);
	        $http.post(uploadUrl, fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        })
	        .success(function(res){
	        	q.resolve(res)
	        })
	        .error(function(err){
	        	q.reject(err)
	        });

	        return q.promise;
	    }
	});







