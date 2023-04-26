const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Company API', () => {


    it('should get a company by companyId', (done) => {
        chai.request(app)
            .get('/api/companies/test')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });


    it('should edit a company by companyId', (done) => {

        const data = {
            companyId: 'test',
            companyName: 'test',
        };

        chai.request(app)
            .put('/api/companies/test/edit')
            .send(data)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });

    it('should get jobs from a company by companyId', (done) => {
        chai.request(app)
            .get('/api/companies/test/jobs')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
    it('should get job applications from a job from companyId and jobId', (done) => {
        chai.request(app)
            .get('/api/companies/test/jobs/test/jobApplications')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
    it('should get all applications from aall job from companyId', (done) => {
        chai.request(app)
            .get('/api/companies/test/jobs/allJobApplications')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
    it('should get all resumes from one job from companyId', (done) => {
        chai.request(app)
            .get('/api/companies/test/jobs/test/resumes')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
    it('gets all users for one job', (done) => {
        chai.request(app)
            .get('/api/companies/test/jobs/test/users')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });







});