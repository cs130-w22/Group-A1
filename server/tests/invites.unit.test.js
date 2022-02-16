const mongoose = require('mongoose');
const supertest = require('supertest');

require('dotenv').config();
const session = require('express-session');

const User = require('../models/user');
const Event = require('../models/event');
const createServer = require('../app');

let userId = null;
let agent = null;

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

let recipientId = null;
let inviteId = null;
let eventId = null;

const setup = async () => {
  await mongoose.connect(
    process.env.TESTDB_URI,
    { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true },
  );
  agent = supertest.agent(createServer([sessionMiddleware]));
  await agent.post('/signup').send({ email: 'test@gmail.com', username: 'test', password: 'test' }).set('session', {}).expect(201)
    .then((res, err) => {
      if (err) return err;
      userId = res.body.userId;
    });
  const recipient = await User.create({
    username: 'test2',
    email: 'test2@gmail.com',
    password: 'abcd',
  });
  recipientId = recipient._id;
  const event = await Event.create({
    name: 'test event',
    timeEarliest: 0,
    timeLatest: 0,
    archived: false,
    owner: userId,
    members: [userId],
  });
  eventId = event._id;
};

describe('Sending normal event invite', () => {
  beforeAll(async () => {
    await setup();
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });
  it('should send a valid event invite and return the id', async () => {
    const mockRequest = {
      recipient: recipientId,
      id: eventId,
      type: 'Event',
    };
    await agent
      .post('/invite')
      .send(mockRequest)
      .expect(201)
      .then((res) => {
        inviteId = res.body;
      });
  });
  it('should add the invite to the user\'s invite list', async () => {
    const user = await User.findById(recipientId);
    return expect(user.invites.includes(inviteId));
  });
});

describe('Sending bad invite', () => {
  beforeAll(async () => {
    await setup();
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });
  it('should return an error if recipient is the sender', async () => {
    const mockRequest = {
      recipient: userId,
      id: eventId,
      type: 'Event',
    };
    await agent
      .post('/invite')
      .send(mockRequest)
      .expect(400);
  });
  it('should return an error if invite already exists', async () => {
    const mockRequest = {
      recipient: recipientId,
      id: eventId,
      type: 'Event',
    };
    await agent
      .post('/invite')
      .send(mockRequest)
      .expect(201);
    await agent
      .post('/invite')
      .send(mockRequest)
      .expect(400);
  });
  it('should return an error if recipient is not valid', async () => {
    await agent
      .post('/invite')
      .send({ recipient: 'blah', id: eventId, type: 'Event' })
      .expect(400);
  });
  it('should return an error if event is not valid', async () => {
    await agent
      .post('/invite')
      .send({ recipient: recipientId, id: 'blah', type: 'Event' })
      .expect(400);
  });
  it('should return an error if event is archived', async () => {
    const event = await Event.findById(eventId);
    event.archived = true;
    await event.save();
    await agent
      .post('/invite')
      .send({ recipient: recipientId, id: event._id, type: 'Event' })
      .expect(400);
  });
  it('should return an error if user is kicked from event', async () => {
    const event = await Event.findById(eventId);
    event.kicked.push({ _id: recipientId });
    await event.save();
    await agent
      .post('/invite')
      .send({ recipient: recipientId, id: event._id, type: 'Event' })
      .expect(400);
  });
  it('should return an error if user is not an event member', async () => {
    const event = await Event.findById(eventId);
    event.members = [];
    await event.save();
    await agent
      .post('/invite')
      .send({ recipient: recipientId, id: event._id, type: 'Event' })
      .expect(400);
  });
});
