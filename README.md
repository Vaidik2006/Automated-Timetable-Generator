# 🗓️ Timetable Generator

A dynamic and constraint-based timetable generator built using **Node.js** and a **simple HTML frontend**. Automatically schedules subjects and teachers across multiple classes while considering free periods, breaks, and teacher day-offs.

## 🚀 Features

- ✅ Auto-generates class-wise timetables
- 👩‍🏫 Assigns two possible teachers per subject
- 📆 Handles teacher day-offs and maximum daily limits
- 🆓 Supports predefined free periods
- 🍽️ Includes break periods in schedule
- 💡 Intelligent random assignment with constraints

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** HTML, CSS, JavaScript
- **Data:** JSON

## 📂 Folder Structure

📦project-root
┣ 📄 index.html # Frontend input form
┣ 📄 timetable_generator_node.js # Node.js backend server
┗ 📄 README.md # This file


## 💻 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/timetable-generator.git
   cd timetable-generator

2. Install dependencies
   npm install

3. Start the server 
  node timetable_generator_node.js

4. Visit app in browser
   http://localhost:4000

📋 Sample Inputs
Number of Classes, Days, Periods

Subject name, period limit, two teacher options

Teacher day-off settings

Free period slots

## 🧠 Logic Overview
Each subject is assigned based on availability and constraints.

A maximum of 4 periods per teacher per day is allowed.

If both teachers are unavailable, the slot is marked as [Free].

Breaks are automatically inserted (e.g., after period 2).

Data is dynamically handled through a POST request from the frontend.

##📈 Future Enhancements
Export to PDF or Excel

User login and admin panel

More advanced subject/teacher preference logic

Improved UI with React or Vue

##🤝 Contributing
Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change.
