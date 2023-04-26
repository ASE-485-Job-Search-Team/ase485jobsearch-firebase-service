const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const expect = chai.expect;

chai.use(chaiHttp);

const { bucket, db } = require("../util/admin");
const resumesRef = db.collection('Resume');

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

    // Need a file to work
    // it("should create a new resume for a user", (done) => {
    //     chai
    //         .request(app)
    //         .post("/api/users/userId/createResume")
    //         .set("Content-Type", "multipart/form-data")
    //         .attach("file", "test/test.pdf")
    //         .end((err, res) => {
    //             expect(err).to.be.null;
    //             expect(res).to.have.status(200);
    //             expect(res.body.status).to.equal("success");
    //             expect(res.body.data).to.have.property("fileName");
    //             expect(res.body.data).to.have.property("resumeId");
    //             expect(res.body.data).to.have.property("userId");
    //             expect(res.body.data).to.have.property("downloadUrl");
    //             done();
    //         });
    // });

    // it("should return an error if no file was uploaded", (done) => {
    //     chai
    //         .request(app)
    //         .post("/api/resume/userId/createResume")
    //         .end((err, res) => {
    //             expect(err).to.be.null;
    //             expect(res).to.have.status(400);
    //             expect(res.body.message).to.equal("No file uploaded");
    //             done();
    //         });
    // });

    // it("should return an error if user already has a resume", (done) => {
    //     chai
    //         .request(app)
    //         .post("/api/resume/userId/createResume")
    //         .set("Content-Type", "multipart/form-data")
    //         .attach("file", "test/test.pdf")
    //         .end((err, res) => {
    //             expect(err).to.be.null;
    //             expect(res).to.have.status(400);
    //             expect(res.body.message).to.equal(
    //                 "User already has an existing resume"
    //             );
    //             done();
    //         });
    // });
    // it('should delete a resume', function (done) {
    //     // First, create a resume to delete
    //     const resumeData = {
    //         fileName: 'test_resume.pdf',
    //         resumeId: '123',
    //         userId: '456',
    //         downloadUrl: 'https://example.com/test_resume.pdf',
    //     };
    //     resumesRef.doc(resumeData.resumeId).set(resumeData).then(() => {
    //         // Send DELETE request to delete the resume
    //         request(app)
    //             .delete('/api/resume/' + resumeData.resumeId + '/delete')
    //             .expect(200)
    //             .end(function (err, res) {
    //                 if (err) return done(err);
    //                 // Check that the resume was deleted
    //                 resumesRef.where('resumeId', '==', resumeData.resumeId)
    //                     .get()
    //                     .then((snapshot) => {
    //                         expect(snapshot.empty).to.be.true;
    //                         done();
    //                     });
    //             });
    //     });
    // });

    // it('should return an error if the resume does not exist', function (done) {
    //     request(app)
    //         .delete('/api/resume/nonexistent_resume/delete')
    //         .expect(400)
    //         .end(function (err, res) {
    //             if (err) return done(err);
    //             expect(res.body.message).to.equal('No resume found.');
    //             done();
    //         });
    // });







});