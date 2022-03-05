const mongoose = require('mongoose');
const supertest = require('supertest');

require('dotenv').config();
const session = require('express-session');

const Event = require('../models/event');
const createServer = require('../app');
const Availability = require('../models/availability');
const PollOption = require('../models/pollOption');
const Poll = require('../models/poll');

let userId = null;
let eventId = null;
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
  cnx = `${cnx.substring(0, cnx.lastIndexOf('/') + 1)}eventTest`;
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

describe('Leaving event', () => {
  beforeAll(async () => {
    await setup();
    const poll = await Poll.create({
      event: eventId,
      question: 'test',
    });
    await PollOption.create({
      poll: poll._id,
      text: 'test option',
      voters: [userId],
    });
    const availabilities = await Availability.updateMany(
      { event: eventId },
      { $push: { users: userId } },
    );
    expect(availabilities.nModified).toEqual(LATEST - EARLIEST + 1);
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });
  it('should return successfully', async () => {
    await agent
      .post(`/event/${eventId}/leave`)
      .send()
      .expect(200);
  });

  it('should return successfully', async () => {
    // check that user was not added
    await agent
      .post(`/event/${eventId}/leave`)
      .send()
      .expect(200);
  });
  it('should remove the user from the member list', async () => {
    const event = await Event.findById(eventId);
    expect(event.members.includes(userId)).toBeFalsy();
  });
  it('should remove the user from all votes', async () => {
    const polls = await Poll.find({ event: eventId });
    polls.forEach(async (p) => {
      const voted = await PollOption.find({ poll: p._id, voters: userId });
      expect(voted).toEqual([]);
    });
  });
  it('should remove user availability', async () => {
    const slots = await Availability.find({ event: eventId, users: userId });
    expect(slots).toEqual([]);
  });
});
