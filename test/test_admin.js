const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Admin API', () => {
    it('should create a new admin profile', (done) => {
        const data = {
            admin_id: '0IG3dea4LMsf1hSYbHN6',
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password',
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

    it('should get an admin profile', (done) => {
        const admin_id = '0IG3dea4LMsf1hSYbHN6';

        chai.request(app)
            .get('/admin')
            .send({ admin_id: admin_id })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('name');
                expect(res.body).to.have.property('email');
                expect(res.body).to.have.property('password');
                done();
            });
    });

    it('should update an admin profile', (done) => {
        const admin_id = '0IG3dea4LMsf1hSYbHN6';

        chai.request(app)
            .put('/admin')
            .send({
                admin_id: admin_id,
                name: 'Weep Woop',
                email: 'janedoe@example.com',
            })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.put).to.equal('success');
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