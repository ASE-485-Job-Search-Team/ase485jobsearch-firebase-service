const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('User API', () => {
    it('Get user by userId', (done) => {
        chai.request(app)
            .get('/api/users/test')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });
    it('Get user by userId that does not exist', (done) => {
        chai.request(app)
            .get('/api/users/nasdfasdfasdfasdfasdf')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                done();
            });
    });
    it('should edit a user', (done) => {
        const data = {
            fullName: 'testedit',
            userId: 'test',
        };
        chai.request(app)
            .put('/api/users/test/edit')
            .send(data)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });
    it('should get applications from userId', (done) => {
        chai.request(app)
            .get('/api/users/test/applications')
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });










});


