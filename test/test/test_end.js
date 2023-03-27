const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Delete', () => {

    it('should delete an admin profile', (done) => {
        const admin_id = '2';

        chai.request(app)
            .delete('/admin')
            .send({
                admin_id: admin_id
            })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.post).to.equal('success');
                done();
            });
    });
    it('should delete a job', (done) => {
        const job_id = '1';

        chai.request(app)
            .delete('/job')
            .send({
                job_id: job_id
            })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.post).to.equal('success');
                done();
            });
    });
    it('should delete an admin profile', (done) => {
        const admin_id = '0IG3dea4LMsf1hSYbHN6';

        chai.request(app)
            .delete('/admin')
            .send({
                admin_id: admin_id
            })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.post).to.equal('success');
                done();
            });
    });
});