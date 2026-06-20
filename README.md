# 🌍 WanderLust – Travel Listing Web App

WanderLust is a full-stack web application that allows users to explore, create, and manage travel listings, similar to platforms like Airbnb.

---

## 🚀 Features

-  Create, edit, and delete property listings
- View detailed listing information
- Add and delete reviews with ratings
- Server-side validation using Joi
- Flash messages for user feedback
- RESTful routing with method-override
- Cascade deletion of reviews when listing is deleted

---

## 🛠️ Tech Stack

- **Frontend:** EJS, Bootstrap, HTML, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Validation:** Joi
- **Other Tools:** Method-Override, Connect-Flash, Express-Session

---

## 📁 Project Structure
WanderLust/
│
├── models/ # Mongoose schemas (Listing, Review)
├── routes/ # Express routes (listings, reviews)
├── views/ # EJS templates
├── public/ # Static files (CSS, JS)
├── utils/ # Custom utilities (WrapAsync, ExpressError)
├── init/ # Sample data for database
├── app.js # Main server file
└── schema.js # Joi validation schemas

---

## ⚙️ Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/wanderlust.git
2. Navigate to the project folder:
cd wanderlust
3. Install dependencies:
npm install
4.Start MongoDB on your system
5.Run the application:
node app.js
6.Open your browser:
http://localhost:8080

