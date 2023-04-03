const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Job API', () => {
    it('should create a admin job mock', (done) => {
        const data = {
            admin_id: '2',
            name: 'asdf',
            email: 'asdf',
            password: 'asdf',
            jobs: ["1"]
        };
        chai.request(app)
            .post('/admin')
            .send(data)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.post).to.equal('success');
                done();
            });
    });
    it('should create a job', (done) => {
        const job_data = {
            "job_id": "1",
            "admin_id": "2",
            "title": "Software Engineer",
            "company": "Google LLC",
            "location": "New York, NY",
            "jobType": "Full-time",
            "description": "We're looking for a talented software engineer to join our team and help us build amazing products.",
            "qualifications": [
                "Bachelor's degree in Computer Science or related field",
                "3+ years of experience in software development",
                "Proficiency in Java, Python, or Ruby",
                "Strong problem-solving skills",
                "Excellent communication skills"
            ],
            "responsibilities": [
                "Develop and maintain high-quality software using best practices",
                "Collaborate with cross-functional teams to design and implement new features",
                "Write clean, efficient, and well-documented code",
                "Participate in code reviews and contribute to continuous improvement of our development processes",
                "Stay up-to-date with emerging trends and technologies in software development"
            ],
            "datePosted": "2022-12-01T00:00:00.000",
            "dateClosing": "2023-01-31T00:00:00.000",
            "companyLogo": "https://companiesmarketcap.com/img/company-logos/64/GOOG.webp",
            "salaryRange": "$150,000 - $180,000"
        };


        chai.request(app)
            .post('/job')
            .send(job_data)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.post).to.equal('success');
                done();
            });

    });



    it('should update an job profile', (done) => {
        const admin_id = '1';
        const job_data = {
            "job_id": "1",
            "admin_id": "2",
            "title": "Only fans senior software developer",
            "company": "Google LLC",
            "location": "New York, NY",
            "jobType": "Full-time",
            "description": "We're looking for a talented software engineer to join our team and help us build amazing products.",
            "application": ["1"],
            "qualifications": [
                "Bachelor's degree in Computer Science or related field",
                "3+ years of experience in software development",
                "Proficiency in Java, Python, or Ruby",
                "Strong problem-solving skills",
                "Excellent communication skills"
            ],
            "responsibilities": [
                "Develop and maintain high-quality software using best practices",
                "Collaborate with cross-functional teams to design and implement new features",
                "Write clean, efficient, and well-documented code",
                "Participate in code reviews and contribute to continuous improvement of our development processes",
                "Stay up-to-date with emerging trends and technologies in software development"
            ],

            "datePosted": "2022-12-01T00:00:00.000",
            "dateClosing": "2023-01-31T00:00:00.000",
            "companyLogo": "https://companiesmarketcap.com/img/company-logos/64/GOOG.webp",
            "salaryRange": "$150,000 - $180,000"
        };
        chai.request(app)
            .put('/job')
            .send(job_data)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.put).to.equal('success');
                done();
            });
    });

    it('should get an job profile', (done) => {
        chai.request(app)
            .get('/job')
            .send({ "job_id": "1" })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('admin_id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('company');
                done();
            });
    });


    it('should get an job feed', (done) => {
        chai.request(app)
            .get('/job/feed')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });

    it('should get resumes sent to job', (done) => {

        chai.request(app)
            .get('/job/jobResumes')
            .send({ job_id: "1" })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array').that.is.length(1);
                done();
            });
    });


    it('should get jobs from admin profile', (done) => {
        const admin_id = '2';

        chai.request(app)
            .get('/admin/jobs')
            .send({ admin_id: admin_id })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array').that.is.length(1);
                done();
            });
    });

    it('should get users from job', (done) => {
        const job = '1';

        chai.request(app)
            .get('/job/jobUsers')
            .send({ job_id: job })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array').that.is.length(1);
                done();
            });
    });


});


