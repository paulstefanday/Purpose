export default /*@ngInject*/ function(Countries, $auth, $http, $timeout, fileUpload, Categories, taOptions) {

  taOptions.toolbar = [
    [ 'h3', 'h4', 'p'],
    ['bold', 'italics', 'ul', 'ol', 'clear'],
    [],
    ['html', 'insertLink']
  ];

  this.categories = Categories;
  this.countries = Countries;

	this.getJobs = () => $http.get('/api/v1/job')
    .then(res => this.jobs = res.data)

  this.update = () => $http.put(`/api/v1/job/${this.selected.id}`, this.selected)
    .then(res => this.selected = false )

  this.delete = (item) => $http.delete(`/api/v1/job/${item.id}`)
    .then(res => {
      this.jobs = this.jobs.filter(record => record.id !== item.id)
    })

  this.select = (item) => {
    this.selected = false
    $timeout(() => this.selected = item, 200);
  }

  this.uploadFile = function(){
    fileUpload.uploadFileToUrl(this.selectedFile, "/api/v1/image")
      .then(res => this.selected.organisation_logo = res.url);
  };

  this.resetFile = () => {
    this.selected.organisation_logo = '';
    this.seletedFile = false;
  }

  this.getJobs();

}
