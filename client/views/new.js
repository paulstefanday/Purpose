export default /*@ngInject*/ function($auth, $http, $timeout, fileUpload, $state) {

  this.create = () => $http.post('/api/v1/job', this.selected).then(res => {
    $state.go('admin.jobs')
  })

}
