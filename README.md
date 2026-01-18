# SCT_WD_4

This is a Task Management Web Application with a beautiful, mindful design. Here's a step-by-step breakdown:

What It Does:
A todo list app where users can create different task lists (Work, Personal, Shopping, etc.) and manage tasks within each list with dates and times.

It includes:
1. Structure (HTML - index.html)
Header with branding ("Mindful Tasks")
Sidebar: Shows all custom lists
Main area: Displays tasks for the selected list
Forms for adding/editing tasks and lists (in modals)

3. Logic (JavaScript - script.js)
TaskApp Class: Manages everything
Features:
Load/save tasks & lists from browser storage (localStorage)
Default lists created: Work, Personal, Shopping
Add new lists via modal popup
Add tasks with description, date, and time
Edit and delete existing tasks
Filter tasks by list selection
Event Listeners: Handle button clicks and keyboard inputs (Enter key)

4. Styling (CSS - styles.css)
Color Palette: Pastel colors (pink #FFB3D9, light blue #D4F1F4, purple #E8D5F2)
Layout: Flexbox for sidebar + main content
Features: Gradient background, rounded corners, smooth animations, responsive design
Technologies Used:
HTML5: Markup & semantic structure
CSS3: Modern styling (gradients, flexbox, transitions)
Vanilla JavaScript: No frameworks; uses ES6 classes for OOP
Key Functionality:
- Create/manage multiple task lists
- Add tasks with date & time
- Edit/delete tasks
- Data persists in browser storage
- Beautiful UI with animations


