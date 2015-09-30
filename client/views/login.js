export default /*@ngInject*/ function($auth, $state, $http) {

  this.go = () => $state.go('admin.jobs')

	this.authenticate = provider => {
    $auth.authenticate(provider).then(res => this.go())
  }

  this.login = () => $auth.login(this.user).then(res => this.go())

}
