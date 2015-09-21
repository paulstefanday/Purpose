export default /*@ngInject*/ function($auth, $http, $timeout, fileUpload) {

	this.getOrgs = () => $http.get('/api/v1/job').then(res => this.organisations = res.data)

  this.startNew = () => {
    this.selected = {}
    this.edit = true
    this.new = true
  }

  this.create = () => $http.post('/api/v1/job', this.selected).then(res => {
    this.organisations.push(res.data)
    this.selected = res.data
    this.new = false
    this.edit = false
  })

  this.update = () => $http.put(`/api/v1/job/${this.selected.id}`, this.selected).then(res => this.edit = false )

  this.delete = () => $http.delete(`/api/v1/job/${this.selected.id}`).then(res => {
    this.selected = false
    this.edit = false
    this.organisations = this.organisations.filter(org => org.id !== res.data.id)
  })

  this.select = (item) => {
    this.selected = false
    this.edit = false
    this.new = false
    $timeout(() => this.selected = item, 200);
  }

  this.uploadFile = function(){
      fileUpload.uploadFileToUrl(this.selectedFile, "/api/v1/image")
        .then(res => this.organisation_logo = res.url);
  };
      
  this.getOrgs();

}