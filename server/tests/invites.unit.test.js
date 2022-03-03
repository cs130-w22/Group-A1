const mongoose = require('mongoose');
const supertest = require('supertest');

require('dotenv').config();
const session = require('express-session');

const User = require('../models/user');
const Event = require('../models/event');
const createServer = require('../app');
const { Invite } = require('../models/invite');

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

let recipient = null;
let inviteId = null;
let eventId = null;

const setup = async () => {
  await mongoose.connect(process.env.TESTDB_URI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  agent = supertest.agent(createServer([sessionMiddleware]));
  await agent
    .post('/signup')
    .send({ email: 'test2@gmail.com', username: 'test2', password: 'test' })
    .set('session', {})
    .expect(201)
    .then((res, err) => {
      if (err) return err;
      recipient = res.body;
    });
  await agent
    .post('/signup')
    .send({ email: 'test@gmail.com', username: 'test', password: 'test' })
    .set('session', {})
    .expect(201)
    .then((res, err) => {
      if (err) return err;
      userId = res.body.userId;
    });
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
      recipient: recipient.username,
      id: eventId,
      type: 'Event',
    };
    await agent
      .post('/invite')
      .send(mockRequest)
      .expect(201)
      .then((res) => {
        inviteId = res.body._id;
      });
  });
  it("should add the invite to the user's invite list", async () => {
    const user = await User.findOne({ username: recipient.username });
    return expect(user.invites.includes(inviteId)).toBeTruthy();
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
    await agent.post('/invite').send(mockRequest).expect(400);
  });
  it('should return an error if invite already exists', async () => {
    const mockRequest = {
      recipient: recipient.username,
      id: eventId,
      type: 'Event',
    };
    await agent.post('/invite').send(mockRequest).expect(201);
    await agent.post('/invite').send(mockRequest).expect(400);
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
      .send({ recipient: recipient.username, id: 'blah', type: 'Event' })
      .expect(400);
  });
  it('should return an error if event is archived', async () => {
    const event = await Event.findById(eventId);
    event.archived = true;
    await event.save();
    await agent
      .post('/invite')
      .send({ recipient: recipient.username, id: event._id, type: 'Event' })
      .expect(400);
  });
  it('should return an error if user is kicked from event', async () => {
    const event = await Event.findById(eventId);
    event.kicked.push({ _id: recipient.userId });
    await event.save();
    await agent
      .post('/invite')
      .send({ recipient: recipient.username, id: event._id, type: 'Event' })
      .expect(400);
  });
  it('should return an error if user is not an event member', async () => {
    const event = await Event.findById(eventId);
    event.members = [];
    await event.save();
    await agent
      .post('/invite')
      .send({ recipient: recipient.username, id: event._id, type: 'Event' })
      .expect(400);
  });
  it('should return an error if recipient is already an event member', async () => {
    const event = await Event.findById(eventId);
    event.members.push({ _id: recipient.userId });
    await event.save();
    await agent
      .post('/invite')
      .send({ recipient: recipient.username, id: event._id, type: 'Event' })
      .expect(400);
  });
});

describe('Accepting event invite', () => {
  beforeAll(async () => {
    await setup();
    const mockRequest = {
      recipient: recipient.username,
      id: eventId,
      type: 'Event',
    };
    await agent
      .post('/invite')
      .send(mockRequest)
      .expect(201)
      .then((res) => {
        inviteId = res.body._id;
      });

    // sign in as recipient
    await agent
      .post('/login')
      .send({
        email: 'test2@gmail.com',
        password: 'test',
      })
      .set('session', {})
      .expect(200);

    // send invite
    await agent.post(`/invite/${inviteId}/accept`).send().expect(200);
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });
  it('should add user to the event', async () => {
    // check that user was added successfully
    const event = await Event.findById(eventId);
    expect(event.members.includes(recipient.userId)).toBeTruthy();
  });
  it('should delete the invite', async () => {
    const invite = await Invite.findById(inviteId);
    expect(invite).toBeNull();

    // check that user has no invites
    const user = await User.findById(recipient.userId).populate('invites');
    expect(user.invites).toHaveLength(0);
  });
});

describe('Declining event invite', () => {
  beforeAll(async () => {
    await setup();
    const mockRequest = {
      recipient: recipient.username,
      id: eventId,
      type: 'Event',
    };
    await agent
      .post('/invite')
      .send(mockRequest)
      .expect(201)
      .then((res) => {
        inviteId = res.body._id;
      });

    // sign in as recipient
    await agent
      .post('/login')
      .send({
        email: 'test2@gmail.com',
        password: 'test',
      })
      .set('session', {})
      .expect(200);

    // send invite
    await agent.post(`/invite/${inviteId}/decline`).send().expect(200);
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });
  it('should not add user to the event', async () => {
    // check that user was not added
    const event = await Event.findById(eventId);
    expect(event.members.includes(recipient.userId)).toBeFalsy();
  });
  it('should delete the invite', async () => {
    const invite = await Invite.findById(inviteId);
    expect(invite).toBeNull();

    // check that user has no invites
    const user = await User.findById(recipient.userId).populate('invites');
    expect(user.invites).toHaveLength(0);
  });
});
