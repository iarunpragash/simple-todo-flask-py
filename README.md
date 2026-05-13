# NexTask Dashboard

A simple Flask-based task management dashboard with a polished front-end experience.

## Overview

This app provides a small task dashboard built with:
- Python + Flask for the backend
- HTML/CSS/JavaScript for a responsive task UI
- In-memory task storage for demo purposes
- Docker support for containerized deployment

## Features

- View task list
- Add new tasks
- Toggle task completion
- Delete tasks
- Task stats: total tasks and completed count

## Prerequisites

- Python 3.11+
- `pip`
- Docker (optional, for container usage)

## Install and Run Locally

1. Create a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start the app:

```bash
python app.py
```

4. Open your browser:

```text
http://localhost:5001
```

## Docker

Build the Docker image:

```bash
docker build -t nextask-dashboard .
```

Run the container:

```bash
docker run -p 5001:5001 nextask-dashboard
```

Then open:

```text
http://localhost:5001
```

## API Endpoints

- `GET /api/tasks`
  - Returns the current list of tasks.

- `POST /api/tasks`
  - Create a new task.
  - JSON body: `{ "title": "New task title" }`

- `DELETE /api/tasks/<task_id>`
  - Delete a task by ID.

- `PATCH /api/tasks/<task_id>/toggle`
  - Toggle a task's completed state.

## Notes

- Data is stored in memory only, so tasks reset when the app restarts.
- The UI uses `static/js/main.js` and `templates/index.html`.
- The app listens on port `5001` by default.

## Project Structure

- `app.py` — Flask application and API routes
- `requirements.txt` — Python dependencies
- `Dockerfile` — container image build instructions
- `templates/index.html` — frontend HTML
- `static/css/style.css` — frontend styles
- `static/js/main.js` — frontend logic
