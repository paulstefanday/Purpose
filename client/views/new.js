export default /*@ngInject*/ function(Categories, taOptions, $auth, $http, $timeout, fileUpload, $state) {

  taOptions.toolbar = [
    [ 'h3', 'h4', 'p'],
    ['bold', 'italics', 'ul', 'ol', 'clear'],
    [],
    ['html', 'insertLink']
  ];

  this.categories = Categories;

  this.create = () => $http.post('/api/v1/job', this.selected).then(res => {
    $state.go('admin.jobs')
  })

}
