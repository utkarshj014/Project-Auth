# 🔐 Project Auth

A complete, full-stack authentication system built with **Node.js**, **React**, **MongoDB**, and **SendGrid**.
Includes email verification, password reset, protected routes, JWT-based auth, and a modern UI.

---

## 🚀 Features

* User Signup & Login
* JWT-Based Authentication with Cookies
* Email Verification (via SendGrid)
* Forgot & Reset Password Flow
* Password Strength Meter
* Modern OTP Input UI
* Protected Dashboard Route
* Responsive & Animated Frontend (Framer Motion)

---

## 💠 Tech Stack

* **Frontend**: React, Vite, Tailwind CSS, Zustand
* **Backend**: Node.js, Express.js, MongoDB
* **Email Service**: SendGrid
* **Deployment**: Render

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and use the following template:

```env
MONGO_URI=
PORT=8000
JWT_SECRET_KEY=
NODE_ENV=development

# Email Configuration (For Sending Emails)
SENDGRID_API_KEY=
SENDGRID_VERIFIED_EMAIL=
SENDGRID_SENDER=

VERIFICATION_EMAIL_TEMPLATEID=
WELCOME_EMAIL_TEMPLATEID=
PASSWORD_RESET_EMAIL_TEMPLATEID=

# Development
CLIENT_URL=http://localhost:5173

# Production
#CLIENT_URL=http://localhost:8000
```

---

## ⚙️ Running the Project Locally

1. **Clone the repo**

```bash
git clone https://github.com/yourusername/project-auth.git
cd project-auth
```

2. **Setup Backend**

```bash
npm install
npm run dev
```

3. **Setup Frontend**

```bash
cd frontend
npm install
npm run dev
```

> Make sure MongoDB and your SendGrid credentials are properly configured in `.env`

---

# 📦 Deployment

Frontend & Backend deployed on **Render**
Uses environment variables for switching between development and production environments



# 📸 Screenshots

![Screenshot (111)](https://github.com/user-attachments/assets/2f1158d9-34d8-463e-b28c-b048ded63193)
![Screenshot (112)](https://github.com/user-attachments/assets/c6a45d4a-7a79-4e13-a6f9-bacf8248d094)
![Screenshot (114)](https://github.com/user-attachments/assets/a85f44c4-4a9a-4492-bbc6-48e16445bd6f)
![Screenshot (113)](https://github.com/user-attachments/assets/c3689a4c-5609-4e81-9e5a-ce6197e59676)

# 📄 License

This project is open-source and available under the **MIT License**.



# 🙌 Feedback & Contributions

Have suggestions or want to contribute?
Feel free to open issues or pull requests.



# ⭐ If you found this helpful, don’t forget to star the repo!
