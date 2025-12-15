import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.title);

  function save() {
    if (!text.trim()) return;
    onUpdate(task.id, text.trim(), task.done);
    setEditing(false);
  }

  return (
    <div
      style={{
        background: "white",
        padding: "14px 18px",
        marginBottom: "12px",
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "0.2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <input
          type="checkbox"
          checked={!!task.done}
          onChange={() => onToggle(task)}
          style={{ width: 18, height: 18, cursor: "pointer" }}
        />

        {editing ? (
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            style={{
              padding: "8px 10px",
              fontSize: 15,
              width: "260px",
              border: "1px solid #ccc",
              borderRadius: 6,
            }}
          />
        ) : (
          <span
            style={{
              textDecoration: task.done ? "line-through" : "none",
              fontSize: 16,
              color: task.done ? "#888" : "#333",
            }}
          >
            {task.title}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {editing ? (
          <>
            <button
              onClick={save}
              style={{
                padding: "6px 14px",
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setText(task.title);
              }}
              style={{
                padding: "6px 14px",
                background: "#9e9e9e",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              style={{
                padding: "6px 14px",
                background: "#1e88e5",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(task.id)}
              style={{
                padding: "6px 14px",
                background: "#e53935",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  async function loadTasks() {
    const res = await fetch(API + "/trabajos");
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask() {
    if (!text.trim()) return;
    await fetch(API + "/trabajos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: text.trim() }),
    });
    setText("");
    loadTasks();
  }

  async function toggleDone(task) {
    await fetch(API + `/trabajos/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: task.title, done: task.done ? 0 : 1 }),
    });
    loadTasks();
  }

  async function updateTask(id, newTitle, done) {
    await fetch(API + `/trabajos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, done }),
    });
    loadTasks();
  }

  async function deleteTask(id) {
    await fetch(API + `/trabajos/${id}`, { method: "DELETE" });
    loadTasks();
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "95%",
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          height: "90vh",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 15,
            fontSize: 22,
            fontWeight: "600",
            color: "#333",
          }}
        >
          Todo List App
        </h1>

        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe una tarea..."
            style={{
              flex: 1,
              padding: "12px",
              fontSize: 16,
              border: "1px solid #ccc",
              borderRadius: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            }}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button
            onClick={addTask}
            style={{
              padding: "12px 20px",
              background: "#FAA18F",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Crear
          </button>
        </div>

        <div style={{ marginTop: 20, overflowY: "auto", paddingRight: 4 }}>
          {tasks.length === 0 ? (
            <p style={{ textAlign: "center", padding: 30, color: "#777" }}>
              No hay tareas por ahora
            </p>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleDone}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
