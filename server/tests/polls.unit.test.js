const mongoose = require('mongoose');
const supertest = require('supertest');

require('dotenv').config();
const session = require('express-session');

const Event = require('../models/event');
const createServer = require('../app');
const PollOption = require('../models/pollOption');
const Poll = require('../models/poll');

let userId = null;
let eventId = null;
let pollId = null;
let optionId = null;
let agent = null;
const EARLIEST = 0;
const LATEST = 5;

// session initialization
const sessionMiddleware = session({
  secret: process.env.SECRET,
  name: 'sessionId',
  saveUninitialized: false,
  cookie: {
    maxAge: 14 * 24 * 60 * 60,
  },
  resave: true,
});

const setup = async () => {
  let cnx = process.env.TESTDB_URI;
  cnx = `${cnx.substring(0, cnx.lastIndexOf('/') + 1)}pollTest`;
  await mongoose.connect((cnx), {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  agent = supertest.agent(createServer([sessionMiddleware]));
  await agent
    .post('/signup')
    .send({ email: 'testy@gmail.com', username: 'testy', password: 'test' })
    .set('session', {})
    .expect(201)
    .then((res, err) => {
      if (err) return err;
      userId = res.body.userId;
    });

  await agent
    .post('/event')
    .send({
      name: 'test',
      timeEarliest: EARLIEST,
      timeLatest: LATEST,
      dates: [new Date()],
    })
    .expect(201)
    .then(async (res) => {
      eventId = res.body;
    });
};

describe('Adding poll', () => {
  beforeAll(async () => {
    await setup();
  });

  it('should return successfully', async () => {
    await agent
      .post(`/polls`)
      .send({
        event: eventId,
        question: 'test',
        maxOptionId: 0,
        votesAllowed: 1,
        addOptionEnabled: true
      })
      .expect(200)
      .then(async (res) => {
        pollId = res.body._id;
      });
  });

  it('should show up in the database', async () => {
    const poll = await Poll.findById(pollId);
    expect(poll).toBeTruthy();
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });
});

describe('Edit poll', () => {
  beforeAll(async () => {
    await setup();
    await agent
      .post(`/polls`)
      .send({
        event: eventId,
        question: 'test',
        maxOptionId: 0,
        votesAllowed: 1,
        addOptionEnabled: true
      })
      .expect(200)
      .then(async (res) => {
        pollId = res.body._id;
      });
  });

  it('should return successfully', async () => {
    await agent
      .patch(`/polls/${pollId}`)
      .send({
        update: {
          question: 'test2'
        }
      })
      .expect(200);
  });

  it('should update the poll question', async () => {
    const poll = await Poll.findById(pollId);
    expect(poll.question === 'test2').toBeTruthy();
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });
});

describe('Delete poll', () => {
  beforeAll(async () => {
    await setup();
    await agent
      .post(`/polls`)
      .send({
        event: eventId,
        question: 'test',
        maxOptionId: 0,
        votesAllowed: 1,
        addOptionEnabled: true
      })
      .expect(200)
      .then(async (res) => {
        pollId = res.body._id;
      });
  });

  it('should return successfully', async () => {
    await agent
      .delete(`/polls/${pollId}`)
      .expect(200);
  });

  it('should not show up in the database', async () => {
    const poll = await Poll.findById(pollId);
    expect(poll).toBeFalsy();
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });
});

describe('Add poll option', () => {
  beforeAll(async () => {
    await setup();
    await agent
      .post(`/polls`)
      .send({
        event: eventId,
        question: 'test',
        maxOptionId: 0,
        votesAllowed: 1,
        addOptionEnabled: true
      })
      .expect(200)
      .then(async (res) => {
        pollId = res.body._id;
      });
  });

  it('should return successfully', async () => {
    await agent
      .post(`/polls/${pollId}/options`)
      .send({
        text: 'test',
      })
      .expect(201)
      .then(async (res) => {
        optionId = res.body._id;
      });
  });

  it('should show up in the database', async () => {
    const option = await PollOption.findById(optionId);
    expect(option).toBeTruthy();
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });
});

describe('Edit poll option', () => {
  beforeAll(async () => {
    await setup();
    await agent
      .post(`/polls`)
      .send({
        event: eventId,
        question: 'test',
        maxOptionId: 0,
        votesAllowed: 1,
        addOptionEnabled: true
      })
      .expect(200)
      .then(async (res) => {
        pollId = res.body._id;
      });
    await agent
      .post(`/polls/${pollId}/options`)
      .send({
        text: 'test',
      })
      .expect(201)
      .then(async (res) => {
        optionId = res.body._id;
      });
  });

  it('should return successfully', async () => {
    await agent
      .patch(`/polls/options/${optionId}`)
      .send({
        update: {
          text: 'test2'
        }
      })
      .expect(200);
  });

  it('should update the poll option text', async () => {
    const option = await PollOption.findById(optionId);
    expect(option.text === 'test2').toBeTruthy();
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });
});

describe('Vote for poll option', () => {
  beforeAll(async () => {
    await setup();
    await agent
      .post(`/polls`)
      .send({
        event: eventId,
        question: 'test',
        maxOptionId: 0,
        votesAllowed: 1,
        addOptionEnabled: true
      })
      .expect(200)
      .then(async (res) => {
        pollId = res.body._id;
      });
    await agent
      .post(`/polls/${pollId}/options`)
      .send({
        text: 'test',
      })
      .expect(201)
      .then(async (res) => {
        optionId = res.body._id;
      });
  });

  it('should return successfully', async () => {
    await agent
      .post(`/polls/vote`)
      .send({
        optionId
      })
      .expect(200);
  });

  it('should have one vote', async () => {
    const option = await PollOption.findById(optionId);
    expect(option.voters.length === 1).toBeTruthy();
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });
});

describe('Delete poll option', () => {
  beforeAll(async () => {
    await setup();
    await agent
      .post(`/polls`)
      .send({
        event: eventId,
        question: 'test',
        maxOptionId: 0,
        votesAllowed: 1,
        addOptionEnabled: true
      })
      .expect(200)
      .then(async (res) => {
        pollId = res.body._id;
      });
    await agent
      .post(`/polls/${pollId}/options`)
      .send({
        text: 'test',
      })
      .expect(201)
      .then(async (res) => {
        optionId = res.body._id;
      });
  });

  it('should return successfully', async () => {
    await agent
      .delete(`/polls/options/${optionId}`)
      .expect(200);
  });

  it('should not show up in the database', async () => {
    const option = await PollOption.findById(optionId);
    expect(option).toBeFalsy();
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });
});