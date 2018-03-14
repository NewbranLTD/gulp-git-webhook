'use strict';
/**
 * Gitlab test
 */
const nothing = () => {};
const supertest = require('supertest');
const payload = require('./fixtures/gitlab-payload.json');
const globalConfig = require('./fixtures/config.json');
const gitWebhookCi = require('../index');
const config = Object.assign(
  {
    provider: 'gitlab'
  },
  globalConfig,
  {
    cmd: (payload, opt) => {
      console.log('Execute gitee callback');
      nothing(opt);
    }
  }
);

const host = [config.host, config.port].join(':');

// Run
describe('Testing with gitlab provider', () => {
  let server;
  beforeAll(done => {
    server = gitWebhookCi(config);
    done();
  });

  afterAll(() => {
    server.close();
  });

  it('It should respond with a push payload', done => {
    supertest(host)
      .post(config.path)
      .set('Accept', 'application/json')
      .set('X-Gitlab-Event', 'Push Hook')
      .set('X-Gitlba-Token', config.secret)
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(err => {
        console.log('err', err);
        done();
      });
  });
});
