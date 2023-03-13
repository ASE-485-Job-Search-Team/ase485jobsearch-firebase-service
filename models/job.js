class Job{
    constructor(job_id, name, company, admin_id, description, application=[]){
        this.job_id = job_id;
        this.admin_id=admin_id
        this.name = name
        this.company = company
        this.description = description
        this.application= application
    }
}