class Job {
    constructor(job_id, name, company, admin_id, description, application = []) {
        this.job_id = job_id;
        this.admin_id = admin_id
        this.name = name
        this.company = company
        this.description = description
        this.application = application
    }
}

var jobSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'number',
            required: true,
        },
        title: {
            type: 'string',
            required: true,
        },
        location: {
            type: 'string',
            required: true,
        },
        jobType: {
            type: 'string',
            required: true,
        },
        description: {
            type: 'string',
            required: true,
        },
        qualifications: {
            type: 'array',
            required: true,
        },
        responsibilities: {
            type: 'array',
            required: true,
        },
        datePosted: {
            type: "string",
            format: "date-time",
            required: true,
        },
        dateClosing: {
            type: "string",
            format: "date-time",
            required: true,
        },
        companyLogo: {
            type: "string",
            required: false,
        },
        salaryRange: {
            type: "string",
            required: false,
        }

    }
}

var tempJobSchema = {
    type: 'object',
    properties: {
        test: {
            type: 'string',
            requried: true
        }

    }
}

module.exports = { tempJobSchema }
