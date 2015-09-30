export default /*@ngInject*/ function($auth, $http, $state, $stateParams) {

	$http.get('/api/v1/job/'+ $stateParams.id)
    .then(res => {
      console.log(res)
      this.job = res.data
    })

}
