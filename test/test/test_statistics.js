const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index'); // Replace with the path to the file where you create the express app
const expect = chai.expect;

chai.use(chaiHttp);

describe('Routes API', () => {
  describe('GET /snapshot', () => {
    it('should return a JSON object with the snapshot data', (done) => {
      chai.request(app)
        .get('/snapshot')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('total_users');
          expect(res.body).to.have.property('total_jobs');
          expect(res.body).to.have.property('new_users_today');
          expect(res.body).to.have.property('job_posts_today');
          expect(res.body).to.have.property('companies');
          done();
        });
    });
  });

  describe('GET /users', () => {
    it('should return a JSON object with the user and admin names', (done) => {
      chai.request(app)
        .get('/users')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('userNames');
          expect(res.body).to.have.property('adminNames');
          done();
        });
    });
  });
});
