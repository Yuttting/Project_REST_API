const express = require('express');
const router = express.Router();
const User = require('./models/user').User;
const Course = require('./models/course').Course;
const Sequelize = require('sequelize');
//const Sequelize = require('sequelize');

const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

/**
 * Middleware to authenticate the request using Basic Authentication.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */
const authenticateUser = (req, res, next) => {
    let message = null;
  
    // Get the user's credentials from the Authorization header.
    const credentials = auth(req);
  
    if (credentials) {
      // Look for a user whose `emailAddress` matches the credentials `name` property.
      const user = users.find(u => u.emailAddress === credentials.name);
      //const user = User.find({emailAddress: credentials.name}) 
  
      if (user) {
        const authenticated = bcryptjs
          .compareSync(credentials.pass, user.password);
        if (authenticated) {
          console.log(`Authentication successful for user: ${user.firstName} ${user.lastName}`);
  
          // Store the user on the Request object.
          req.currentUser = user;
        } else {
          message = `Authentication failure for user: ${user.firstName} ${user.lastName}`;
        }
      } else {
        message = `User not found for user: ${user.firstName} ${user.lastName}`;
      }
    } else {
      message = 'Auth header not found';
    }
  
    if (message) {
      console.warn(message);
      res.status(401).json({ message: 'Access Denied' });
    } else {
      next();
    }
};
  
//GET /api/users 200 - Returns the currently authenticated user
router.get('/users',  authenticateUser, (req, res, next) => {
    const user = req.currentUser;

    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
    });

    next();
});

//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', [
    check('firstName')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "firstName"'),
    check('lastName')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "lastName"'),
    check('emailAddress')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "emailAddress"'),
    check('password')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "password"'),
  ], async (req, res) => {
    // Attempt to get the validation result from the Request object.
    const errors = validationResult(req);
  
    // If there are validation errors...
    if (!errors.isEmpty()) {
      // Use the Array `map()` method to get a list of error messages.
      const errorMessages = errors.array().map(error => error.msg);
  
      // Return the validation errors to the client.
      return res.status(400).json({ errors: errorMessages });
    }
  
    // Get the user from the request body.
    const user = req.body;
  
    // Hash the new user's password.
    user.password = bcryptjs.hashSync(user.password);
  
    // Add the user to the `users` database.
    user = await User.create(user);
  
    // Set the status to 201 Created and end the response.
    return res.status(201).end();

  });
  

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/courses', async (req, res, next) => {
    const courses = await Course.findAll();
    res.json(courses);
    next();
});

// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', async(req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    res.json(course);
    next();
});

// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', [
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "title"'),
  check('description')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please provide a value for "description"')
], authenticateUser, async(req,res, next) => {
  const course = await Course.create(req.body);
  res.status(201).end();
  next();
});

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', [
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "title"'),
  check('description')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please provide a value for "description"')
], authenticateUser, async(req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  await course.update(req.body);
  res.status(204).end();
  next();
});

// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/courses/:id', authenticateUser, async(req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  await course.delete(req.body);
  res.status(204).end();
  next();
})

module.exports = router;
