class User{
    constructor(user_id, name, description, resume_id, applications = []){
        this.resume_id=resume_id
        this.user_id =user_id
        this.name = name
        this.description = description
        this.applications = applications
    }
}
