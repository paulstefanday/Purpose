export default /*@ngInject*/ function($stateProvider, $urlRouterProvider, $authProvider, taOptions) {

  taOptions.toolbar = [
      [ 'h4', 'p', 'pre', 'quote'],
      ['bold', 'italics', 'underline', 'ul', 'ol', 'clear'],
      [],
      ['html', 'wordcount', 'charcount']
  ];

  $urlRouterProvider.otherwise("/");

  $authProvider.loginUrl = '/api/v1/login';
  $authProvider.signupUrl = '/api/v1/signup';
  $authProvider.tokenPrefix = 'purposeApp';
  $authProvider.authHeader = 'Authorization';
  $authProvider.authToken = '';

  // Facebook
  $authProvider.facebook({
    clientId: process.env.ENV === 'production' ? "535096706647433" : "535124743311296",
    url: '/api/v1/facebook',
    authorizationEndpoint: 'https://www.facebook.com/v2.4/dialog/oauth',
    scope: ["public_profile", "email"],
    type: '2.4'
  });

  $stateProvider
    .state('home', {
      url: "/",
      controllerAs: 'vm',
      controller: require('./views/home.js'),
      template: require('./views/home.jade')
    })
    .state('admin', {
      abstract: true,
      template: "<ui-view></ui-view>",
      resolve: {
        auth: /*@ngInject*/ ($auth, $q, $state) => {
          let q = $q.defer();
          if($auth.isAuthenticated()) q.resolve({});
          else {
            $state.go('home');
            q.reject({});
          }
          return q.promise;
        }
      }
    })
    .state('admin.jobs', {
      url: "/jobs",
      controllerAs: 'vm',
      controller: require('./views/jobs.js'),
      template: require('./views/jobs.jade')
    })
    .state('admin.new', {
      url: "/new",
      controllerAs: 'vm',
      controller: require('./views/new.js'),
      template: require('./views/new.jade')
    })
    .state('login', {
      url: "/login",
      controllerAs: 'vm',
      controller: require('./views/login.js'),
      template: require('./views/login.jade')
    })
    .state('signup', {
      url: "/signup",
      controllerAs: 'vm',
      controller: require('./views/signup.js'),
      template: require('./views/signup.jade')
    })
    .state('preview', {
      url: "/preview/:id",
      controllerAs: 'vm',
      controller: require('./views/preview.js'),
      template: require('./views/preview.jade')
    })
}

