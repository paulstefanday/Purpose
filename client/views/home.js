export default /*@ngInject*/ function($auth, $state, $http, Categories) {

	this.authenticate = function(provider) {
    $auth.authenticate(provider).then(res => $state.go('admin.jobs'));
  };

  this.categories = Categories;

  this.isUser = () => $auth.isAuthenticated()

  this.changeFeed = () => {
    let data =  this.type ? { query: { category: this.type } } : {}
    $http.post('/api/v1/search', data).then(res => this.jobs = res.data)
  }

  this.getJobs = () => $http.get('/api/v1/search')
    .then(res => this.jobs = res.data)

  this.getJobs();

}
