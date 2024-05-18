// const express = require("express");
// const app = express();
// require("dotenv").config();
// const cloudinary = require('cloudinary').v2;
// const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';
// const { SwaggerUIBundle, SwaggerUIStandalonePreset } = require('swagger-ui-dist');
// const admin = require("firebase-admin");
// const credentials = require("./key.json");
// var cors = require('cors');
// const bodyParser = require("body-parser");
// const swaggerUi = require('swagger-ui-express');
// const swaggerJsdoc = require('swagger-jsdoc');
// const PORT = process.env.PORT || 8080
// // Initialize Firebase Admin SDK
// admin.initializeApp({
//     credential: admin.credential.cert(credentials)
// });

// const db = admin.firestore();

// // Middleware setup
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(bodyParser.json());


// const options = {
//   customCssUrl: CSS_URL,
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Bitstock API",
//       version: "1.0.0",
//       description: "API for managing applicants"
//     },
//     servers: [
//       {
//         url: "https://job-api-rosy.vercel.app",
//       },
//     ],
//   },
//   apis: ["./Server.js"], // files containing annotations for the Swagger docs
// };

// const specs = swaggerJsdoc(options);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


const express = require("express");

require("dotenv").config();
const cloudinary = require('cloudinary').v2;
const admin = require("firebase-admin");
const credentials = require("./key.json");
const cors = require('cors');
const bodyParser = require("body-parser");
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const PORT = process.env.PORT || 8080;

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bitstock API",
      version: "1.0.0",
      description: "API for managing applicants"
    },
    servers: [
      {
        url: "https://job-api-rosy.vercel.app",
      },
    ],
  },
  apis: ["./Server.js"], // files containing annotations for the Swagger docs
};

const db = admin.firestore();


const app = express();
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// Swagger setup
const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';



const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Example isAdmin middleware
const isAdmin = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  const userId = token;
  const user = getUserFromDatabase(userId);

  console.log(user);

  if (user === null) {
    return res.status(401).send('Unauthorized');
  }

  req.user = user;
  next();
}

// Swagger documentation annotations
/**
 * @swagger
 * components:
 *   schemas:
 *     Applicant:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNo
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         middleName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phoneNo:
 *           type: string
 *         idFrontPic:
 *           type: string
 *         idFrontPicTwo:
 *           type: string
 *         idBackPic:
 *           type: string
 *         idBackPicTwo:
 *           type: string
 *         state:
 *           type: string
 *         ssn:
 *           type: string
 *         resume:
 *           type: string
 *     Job:
 *       type: object
 *       required:
 *         - jobTitle
 *         - jobDescription
 *         - state
 *       properties:
 *         jobTitle:
 *           type: string
 *         jobDescription:
 *           type: string
 *         experience:
 *           type: string
 *         state:
 *           type: string
 *         remote:
 *           type: boolean
 *         pay:
 *           type: string
 *         level:
 *           type: string
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     responses:
 *       201:
 *         description: Welcome to Bitstock API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /applicants:
 *   post:
 *     summary: Add a new applicant
 *     tags: [Applicants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Applicant'
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Applicant'
 *       500:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 */



app.get('/', (req, res) => {
  res.status(201).json({
    message: 'Welcome to Bitstock API',
    port: PORT
  });
});

// Create applicants



/**
 * @swagger
 * /applicants:
 *   get:
 *     summary: Get applicants with pagination and search
 *     tags: [Applicants]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by first name, last name, or middle name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page for pagination
 *     responses:
 *       200:
 *         description: A list of applicants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Applicant'
 *                 total:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *       404:
 *         description: No applicants found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */



app.post('/applicants', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      email,
      phoneNo,
      idFrontPic,
      idFrontPicTwo,
      idBackPic,
      idBackPicTwo,
      state,
      ssn,
      resume
    } = req.body;

    const usersRef = db.collection('people');
    const newUser = {
      firstName,
      lastName,
      middleName,
      email,
      phoneNo,
      idFrontPic,
      idBackPic,
      idFrontPicTwo,
      idBackPicTwo,
      state,
      ssn,
      resume
    };

    const docRef = await usersRef.add(newUser);

    res.status(201).json({
      id: docRef.id,
      status: 201,
      message: 'Application submitted successfully!!!',
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong, try again.',
    });
  }
});




// Get all applicants with pagination and search
app.get('/applicants', async (req, res) => {
  try {
    const { search, page = 1, pageSize = 10 } = req.query;
    const pageInt = parseInt(page);
    const pageSizeInt = parseInt(pageSize);
    const offset = (pageInt - 1) * pageSizeInt;

    let applicants = [];
    let total = 0;

    if (search) {
      // Perform multiple queries for each field
      const firstNameQuery = db.collection('people').where('firstName', '>=', search).where('firstName', '<=', search + '\uf8ff');
      const middleNameQuery = db.collection('people').where('middleName', '>=', search).where('middleName', '<=', search + '\uf8ff');
      const lastNameQuery = db.collection('people').where('lastName', '>=', search).where('lastName', '<=', search + '\uf8ff');

      // Execute queries and collect results
      const [firstNameSnapshot, middleNameSnapshot, lastNameSnapshot] = await Promise.all([
        firstNameQuery.get(),
        middleNameQuery.get(),
        lastNameQuery.get(),
      ]);

      // Combine results and remove duplicates
      const results = {};
      firstNameSnapshot.forEach(doc => results[doc.id] = doc.data());
      middleNameSnapshot.forEach(doc => results[doc.id] = doc.data());
      lastNameSnapshot.forEach(doc => results[doc.id] = doc.data());

      applicants = Object.keys(results).map(id => ({ id, ...results[id] }));
      total = applicants.length;

      // Apply pagination
      applicants = applicants.slice(offset, offset + pageSizeInt);
    } else {
      // No search, perform simple pagination query
      const totalSnapshot = await db.collection('people').get();
      total = totalSnapshot.size;

      const snapshot = await db.collection('people').offset(offset).limit(pageSizeInt).get();
      snapshot.forEach(doc => {
        applicants.push({ id: doc.id, ...doc.data() });
      });
    }

    // Return the paginated and searched applicants
    res.status(200).json({
      status: 200,
      data: applicants,
      total,
      currentPage: pageInt,
      pageSize: pageSizeInt,
    });
  } catch (error) {
    console.error('Error getting applicants:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong, try again.',
    });
  }
});


//create job


/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Add a new job
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       500:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 */



app.post('/jobs', async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      experience,
      state,
      remote,
      pay,
      level
    } = req.body;

    const jobsRef = db.collection('jobs');
    const newJob = {
      jobTitle,
      jobDescription,
      experience,
      state,
      remote,
      pay,
      level
    };

    const docRef = await jobsRef.add(newJob);

    res.status(201).json({
      id: docRef.id,
      status: 201,
      message: 'Job created successfully!!!',
      data: newJob
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong, try again.',
    });
  }
});


// get job

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get jobs with pagination and search
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by job title or job description
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter by state
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page for pagination
 *     responses:
 *       200:
 *         description: A list of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 total:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *       404:
 *         description: No jobs found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */


app.get('/jobs', async (req, res) => {
  try {
    const { search, state, page = 1, pageSize = 10 } = req.query;
    const pageInt = parseInt(page);
    const pageSizeInt = parseInt(pageSize);
    const offset = (pageInt - 1) * pageSizeInt;

    let jobs = [];
    let total = 0;

    // Base query
    let query = db.collection('jobs');

    // Search by job title and job description
    let jobTitleSnapshot, jobDescriptionSnapshot;

    if (search) {
      const jobTitleQuery = db.collection('jobs')
        .where('jobTitle', '>=', search)
        .where('jobTitle', '<=', search + '\uf8ff');

      const jobDescriptionQuery = db.collection('jobs')
        .where('jobDescription', '>=', search)
        .where('jobDescription', '<=', search + '\uf8ff');

      [jobTitleSnapshot, jobDescriptionSnapshot] = await Promise.all([
        jobTitleQuery.get(),
        jobDescriptionQuery.get()
      ]);
      
      const results = {};
      jobTitleSnapshot.forEach(doc => results[doc.id] = doc.data());
      jobDescriptionSnapshot.forEach(doc => results[doc.id] = doc.data());
      
      jobs = Object.keys(results).map(id => ({ id, ...results[id] }));
      
      total = jobs.length;
      
      // Apply state filter
      if (state) {
        jobs = jobs.filter(job => job.state === state);
        total = jobs.length;
      }
      
      // Apply pagination
      jobs = jobs.slice(offset, offset + pageSizeInt);
    } else {
      // If no search term is provided, apply pagination and state filter
      if (state) {
        query = query.where('state', '==', state);
      }

      const totalSnapshot = await query.get();
      total = totalSnapshot.size;

      const snapshot = await query.offset(offset).limit(pageSizeInt).get();
      snapshot.forEach(doc => {
        jobs.push({ id: doc.id, ...doc.data() });
      });
    }

    if (jobs.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No jobs found',
      });
    }

    // Return the paginated and searched jobs
    res.status(200).json({
      status: 200,
      data: jobs,
      total,
      currentPage: pageInt,
      pageSize: pageSizeInt,
    });
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong, try again.',
    });
  }
});





app.delete('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Reference to the job document
    const jobRef = db.collection('jobs').doc(id);
    
    // Check if the job exists
    const doc = await jobRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        status: 404,
        message: 'Job not found',
      });
    }

    // Delete the job
    await jobRef.delete();

    res.status(200).json({
      status: 200,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong, try again.',
    });
  }
});



/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the job to delete
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 */





/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 */

app.post('/users', async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const usersRef = db.collection('loggers');
    const newUser = {
      email,
      password,
    };

    const docRef = await usersRef.add(newUser);

    res.status(201).json({
      id: docRef.id,
      status: 201,
      message: 'User created successfully!!!',
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong, try again.',
    });
  }
});



/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Get a user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Something went wrong, try again.
 */

app.get('/users/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const userSnapshot = await db.collection('loggers').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(404).json({
        status: 404,
        message: 'User not found',
      });
    }

    let user;
    userSnapshot.forEach(doc => {
      user = { id: doc.id, ...doc.data() };
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong, try again.',
    });
  }
});


/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset user's password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Something went wrong, try again.
 */

app.post('/users/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const userSnapshot = await db.collection('loggers').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(404).json({
        status: 404,
        message: 'User with this email not found',
      });
    }

    let userId;
    userSnapshot.forEach(doc => {
      userId = doc.id;
    });

    // Update password
    await db.collection('loggers').doc(userId).update({
      password: newPassword
    });

    res.status(200).json({
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong, try again.',
    });
  }
});






/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User logged in successfully
 *                 token:
 *                   type: string
 *                   example: user123
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Something went wrong, try again.
 */




app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userSnapshot = await db.collection('loggers').where('email', '==', email).where('password', '==', password).get();

    if (userSnapshot.empty) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid Username or Password',
      });
    }

    let userId;
    userSnapshot.forEach(doc => {
      userId = doc.id;
    });

    res.status(200).json({
      message: 'logged in successfully',
      token: userId
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong, try again.',
    });
  }
});





app.listen(PORT, ()=>{
    console.log(`server is running on PORT ${PORT}...`)
})
