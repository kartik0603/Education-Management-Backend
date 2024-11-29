# Educational Management API

This project provides a comprehensive educational management API for managing users, courses, authentication, and more. It includes endpoints for user registration, login, course creation, and various other functionalities required for an educational platform.

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Directory Structure](#directory-structure)
- [Database Connection Diagram](#database-connection-diagram)
- [API Endpoints](#api-endpoints)
- [Setup](#setup)
- [Usage](#usage)

## Project Overview

The Educational Management API enables the management of users, courses, and authentication processes. It allows for functionalities like user registration and login, password reset, course management, and user roles (Admin, Teacher, Student). It supports JWT-based authentication and provides documentation via Swagger UI.

### Key Features:
- **User Management:** Admin can manage users and assign roles (Admin, Teacher, Student).
- **Course Management:** Admin and Teacher can manage course data (create, update, delete).
- **Authentication:** User authentication via JWT tokens.
- **Swagger UI:** Comprehensive API documentation available via Swagger UI.

## Technologies Used

- **Node.js** – JavaScript runtime for server-side development.
- **Express.js** – Web application framework for Node.js.
- **MongoDB** – NoSQL database for storing data.
- **Mongoose** – ODM for MongoDB.
- **Swagger UI** – For API documentation.
- **dotenv** – For managing environment variables.
- **JWT (JSON Web Token)** – For secure user authentication.

## Directory Structure

# Project Directory Structure

```
.
├── config
│   └── db.js
├── controllers
│   ├── assin_submi.controller.js
│   ├── course.controller.js
│   ├── grade.controller.js
│   └── user.controller.js
├── middleware
│   ├── auth.middleware.js
│   └── roleCheck.middleware.js
├── models
│   ├── assignment.schema.js
│   ├── course.schema.js
│   ├── grade.schema.js
│   ├── submission.schema.js
│   └── user.schema.js
├── routes
│   ├── assignment_submission.route.js
│   ├── course.route.js
│   ├── grade.route.js
│   └── user.route.js
├── secure
│   └── hashPassword.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js


## Entity Relationship Diagram


+--------------+         +--------------+
|   User       |         |   Course     |
+--------------+         +--------------+
        |                        |
        |                        |
        +---< Has Many >----------+
        |
+--------------+
|  AuthData    |
+--------------+



API Routes Overview
===================

/api/users
-----------
POST    /register                 - Register a new user
POST    /login                    - Login a user
POST    /forget-password          - Send password reset email
POST    /reset-password/:token    - Reset password using token

/api/courses
-------------
POST    /admin/course             - Admin: Create a course
POST    /create-course            - Teacher/Admin: Create a course
PUT     /update-course/:courseId  - Admin/Teacher: Update course
GET     /all-courses              - Admin/Teacher/Student: View all courses
GET     /enrolled-courses         - Student: View enrolled courses
DELETE  /delete-course/:courseId  - Admin/Teacher: Delete a course

/api/grades
------------
POST    /assign-grade/:submissionId   - Teacher: Assign grade to a submission
GET     /grades-by-student            - Student: View own grades
GET     /all-grades-for-course/:courseId - Teacher: View all grades for a course
GET     /course-statistics/:courseId - Teacher: View course statistics
GET     /student-grades-details/:courseId - Teacher: View student grades details

/api/submissions
----------------
POST    /assignments                 - Teacher: Create an assignment
PUT     /assignments/:assignmentId   - Teacher: Update an assignment
DELETE  /assignments/:assignmentId   - Teacher: Delete an assignment
PUT     /assignments/:assignmentId/due-date - Teacher: Set assignment due date
GET     /get-assignments-by-teacher/:teacherId - Teacher: View all assignments by teacher
GET     /submissions                 - Teacher: View all submissions
GET     /submissions/student/:courseId/:studentId - Teacher: View student submissions
GET     /assignments/:courseId       - Teacher/Student: View assignments for a course
PUT     /update-submission/:submissionId - Teacher/Student: Update a submission
DELETE  /submissions/:submissionId   - Teacher/Student: Delete a submission
POST    /submit-assignment           - Student: Submit an assignment


# Explanation of the API Routes Structure

## User Routes (`/api/users`)
- **POST** `/register`: Registers a new user.
- **POST** `/login`: Allows a user to log in and receive a JWT token.
- **POST** `/forget-password`: Sends a password reset link to the user's email.
- **POST** `/reset-password/:token`: Resets the user's password using a provided token.

## Course Routes (`/api/courses`)
- **POST** `/admin/course`: Admin can create a new course.
- **POST** `/create-course`: Both Admin and Teacher can create a new course.
- **PUT** `/update-course/:courseId`: Admin/Teacher can update a course.
- **GET** `/all-courses`: Admin/Teacher/Student can view all available courses.
- **GET** `/enrolled-courses`: Students can view the courses they are enrolled in.
- **DELETE** `/delete-course/:courseId`: Admin/Teacher can delete a course.

## Grade Routes (`/api/grades`)
- **POST** `/assign-grade/:submissionId`: Teacher assigns a grade to a student's submission.
- **GET** `/grades-by-student`: Student can view their own grades.
- **GET** `/all-grades-for-course/:courseId`: Teacher can view all grades for a specific course.
- **GET** `/course-statistics/:courseId`: Teacher can view statistics for a specific course.
- **GET** `/student-grades-details/:courseId`: Teacher can view detailed grades for all students in a course.

## Assignment and Submission Routes (`/api/submissions`)
- **POST** `/assignments`: Teacher creates a new assignment.
- **PUT** `/assignments/:assignmentId`: Teacher updates an existing assignment.
- **DELETE** `/assignments/:assignmentId`: Teacher deletes an assignment.
- **PUT** `/assignments/:assignmentId/due-date`: Teacher sets the due date for an assignment.
- **GET** `/get-assignments-by-teacher/:teacherId`: Teacher views all assignments they have created.
- **GET** `/submissions`: Teacher views all submissions.
- **GET** `/submissions/student/:courseId/:studentId`: Teacher views a specific student's submission.
- **GET** `/assignments/:courseId`: Teacher/Student views assignments available for a course.
- **PUT** `/update-submission/:submissionId`: Teacher/Student updates a submission.
- **DELETE** `/submissions/:submissionId`: Teacher/Student deletes a submission.
- **POST** `/submit-assignment`: Student submits an assignment.


# API Routes Interaction Diagram


+------------------+               +----------------+               +--------------------+
|    /api/users    | --------------> |   /api/courses | --------------> |   /api/grades      |
|                  |   Register     |                |   Create/Update |                    |
|  POST /register  |               |  POST /create  |               |  POST /assign-grade |
|  POST /login     |               |  GET /all-courses|             |  GET /grades-by-student|
|  POST /reset-password |           |  PUT /update-course |           |  GET /all-grades-for-course |
+------------------+               +----------------+               +--------------------+
        |                                |
        |                                |
        |                                |
+------------------+                    +-------------------------+
| /api/submissions |                    | /api/courses (Student)  |
|                  |                    |                         |
| POST /submit-assignment  <----------  |  GET /enrolled-courses  |
| PUT /update-submission |             |                         |
+------------------+                    +-------------------------+



