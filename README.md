 Role-Based Content Management System

Overview:

This project is a Role-Based Content Management System built with Node.js, Express, and MongoDB. It supports three types of users:

- Admin: Has full access to manage users and content.
- Moderator: Can create content and flag content as inappropriate.
- User: Can view content but cannot create or flag it.

- Logout: Users can log out and invalidate the session.
- View Content: All users can view the content created by Admin and Moderator.


 User Features:
- Registration: Users can register with a username and password.
- Login: Users can log in to get an authentication token.
- Profile: Users can view their profile details.

   Admin Features:
- View All Users: Admins can view the list of all registered users.
- Create Content: Admins can create new content (posts, articles, etc.).
- View Content: Admins can view the list of all content.

Moderator Features:
- Create Content: Moderators can create content.
- Flag Content: Moderators can flag inappropriate content.
- View Content: Moderators can view all content.

Technologies Used
- Node.js: JavaScript runtime to build the server-side logic.
- Express: Web framework for building APIs.
- MongoDB: NoSQL database for storing users and content data.
- JWT: JSON Web Token for authenticating and authorizing users.
- Bcrypt:which is npm package using for hasing and salting password.

  Authentication and Authorization
This application uses JWT (JSON Web Tokens) for user authentication and role-based authorization. The auth middleware verifies the user's role before allowing access to protected route AND isLogIn middleware verifies the user's login or not,if user is login then they have must their JWT . The user roles are as follows:

Admin: Full access to all content and user management.
Moderator: Can create and flag content.
User: Can view content but cannot create or flag content.
