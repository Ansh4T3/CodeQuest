# 🚀 CodeQuest - Coding Platform

A competitive coding platform where users can create problems, solve them, and get scored based on test case performance.

## ✨ Features

- **Create Problems**: Add coding problems with title, description, and test cases
- **Test Case Management**: Support for visible and hidden test cases
- **Code Editor**: Monaco editor with C language support
- **Code Execution**: Run code against visible test cases
- **Code Submission**: Submit code for scoring against hidden test cases
- **Scoring System**: Percentage-based scoring based on hidden test case performance

## 🏗️ Project Structure

```
codeQuest/
├── backend/                 # Django Backend
│   ├── codequest_backend/  # Django project settings
│   ├── problems/           # Problems app
│   ├── submissions/        # Submissions app
│   ├── requirements.txt    # Python dependencies
│   └── manage.py          # Django management
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── pages/         # React components
│   │   └── App.js         # Main app component
│   └── package.json       # Node dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (running on localhost:27017)
- GCC compiler (for C code execution)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Django server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start React development server:**
   ```bash
   npm start
   ```

## 🌐 Usage

1. **Open your browser** and go to `http://localhost:3000`
2. **Create Problems**: Click "Create" to add new coding problems
3. **View Problems**: Click "Problems" to see all available problems
4. **Solve Problems**: Click on any problem to open the code editor
5. **Test Code**: Use "Run" button to test against visible test cases
6. **Submit Code**: Use "Submit" button to get scored against hidden test cases

## 🔧 API Endpoints

- `GET /api/problems/` - Get all problems
- `POST /api/problems/add/` - Create new problem
- `GET /api/problems/{id}/detail/` - Get problem details
- `POST /api/problems/run/` - Run code against visible test cases
- `POST /api/problems/submit/` - Submit code for scoring

## 🎯 How It Works

1. **Problem Creation**: Users create problems with visible and hidden test cases
2. **Code Writing**: Users write C code in the Monaco editor
3. **Code Testing**: "Run" button executes code against visible test cases only
4. **Code Submission**: "Submit" button runs code against ALL test cases
5. **Scoring**: Score is calculated based on hidden test case performance
6. **Results**: Detailed feedback shows which test cases passed/failed

## 🛠️ Technology Stack

- **Backend**: Django + Django REST Framework + MongoDB
- **Frontend**: React + React Router + Monaco Editor
- **Code Execution**: Subprocess with GCC compiler
- **Styling**: Bootstrap 5

## 🔒 Security Features

- CORS enabled for development
- Temporary file execution for code safety
- Timeout limits on code execution
- Input validation and sanitization

## 🚧 Development Notes

- This is an MVP version
- Currently supports C language only
- Test cases are stored in MongoDB
- Code execution happens in temporary directories
- Scoring is percentage-based on hidden test cases

## 🤝 Contributing

Feel free to contribute to this project by:
- Adding support for more programming languages
- Improving the UI/UX
- Adding more security features
- Implementing user authentication
- Adding leaderboards and rankings

## 📝 License

This project is open source and available under the MIT License.
