const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Delete', () => {

    it('should delete a job posting', (done) => {
        chai.request(app)
            .delete('/api/jobs/test/delete')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });
    it('should delete a user', (done) => {
        chai.request(app)
            .delete('/api/users/test/delete')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });
    it('should delete a company', (done) => {
        chai.request(app)
            .delete('/api/companies/test/delete')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });
});