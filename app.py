import uuid
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# In-memory database for demonstration
tasks = [
    {"id": str(uuid.uuid4()), "title": "Design Premium UI", "completed": True},
    {"id": str(uuid.uuid4()), "title": "Implement Flask Backend", "completed": False},
    {"id": str(uuid.uuid4()), "title": "Add Micro-animations", "completed": False},
]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)

@app.route("/api/tasks", methods=["POST"])
def add_task():
    data = request.json
    if not data or "title" not in data:
        return jsonify({"error": "Title is required"}), 400
    
    new_task = {
        "id": str(uuid.uuid4()),
        "title": data["title"],
        "completed": False
    }
    tasks.insert(0, new_task)
    return jsonify(new_task), 201

@app.route("/api/tasks/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    global tasks
    tasks = [t for t in tasks if t["id"] != task_id]
    return "", 204

@app.route("/api/tasks/<task_id>/toggle", methods=["PATCH"])
def toggle_task(task_id):
    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = not task["completed"]
            return jsonify(task)
    return jsonify({"error": "Task not found"}), 404

if __name__ == "__main__":
    # Running on port 5001 as in the original app
    app.run(host="0.0.0.0", port=5001, debug=True)

