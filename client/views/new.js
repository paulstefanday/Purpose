export default /*@ngInject*/ function(Countries, Categories, taOptions, $auth, $http, $timeout, fileUpload, $state) {

  taOptions.toolbar = [
    [ 'h3', 'h4', 'p'],
    ['bold', 'italics', 'ul', 'ol', 'clear'],
    [],
    ['html', 'insertLink']
  ];

  this.categories = Categories
  this.countries = Countries
  this.selected = {}

  this.create = () => $http.post('/api/v1/job', this.selected).then(res => {
    $state.go('admin.jobs')
  })

  this.uploadFile = function(){
    fileUpload.uploadFileToUrl(this.selectedFile, "/api/v1/image")
      .then(res => this.selected.organisation_logo = res.url);
  };

  this.resetFile = () => {
    this.selected.organisation_logo = '';
    this.seletedFile = false;
  }

}
