const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Job API', () => {
    it('should create a company mock', (done) => {
        const data = {
            companyId: 'test',
            companyName: 'test',
        };
        chai.request(app)
            .post('/api/companies/create')
            .send(data)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.post).to.equal('success');
                done();
            });
    });
    it('should create a user mock', (done) => {
        const data = {
            fullName: 'test',
            userId: 'test',
        };
        chai.request(app)
            .post('/api/users/create')
            .send(data)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.post).to.equal('success');
                done();
            });
    });
    it('should create a job', (done) => {
        const job_data = {
            "jobId": "test",
            "companyId": "test",
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
            .post('/api/jobs/create')
            .send(job_data)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });

    });



    it('should update an job profile', (done) => {
        const companyId = 'test';
        const job_data = {
            "jobId": "test",
            "companyId": "test",
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
            .put('/api/jobs/test/edit')
            .send(job_data)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });

    it('should get a job', (done) => {
        chai.request(app)
            .get('/api/jobs/test')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });

    it('should get all jobs', (done) => {
        chai.request(app)
            .get('/api/jobs/job-postings')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });


    it('apply to a job', (done) => {

        chai.request(app)
            .get('/api/jobs/apply')
            .send({
                id: 'test',
                jobId: "test",
                userId: "test"

            })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });







});


