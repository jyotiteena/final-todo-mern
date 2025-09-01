import axios from "axios";
import React, { useState, useEffect } from "react";
console.log(`${import.meta.env.BASE_URL}`)
let api = import.meta.env.VITE_BASE_URL
const MockApi = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [editProject, setEditProject] = useState(null);

  const [newTodo, setNewTodo] = useState({ title: "", description: "", status: "" });
  const [editTodo, setEditTodo] = useState(null);

  const columns = [
    { title: "REQUESTED", key: "requested" },
    { title: "TO DO", key: "todo" },
    { title: "IN PROGRESS", key: "progress" },
    { title: "DONE", key: "done" },
  ];

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${api}/projects`);
      setProjects(res.data.data || []);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchTodos = async (projectId) => {
    try {
      const res = await axios.get(`${api}/todos?projectId=${projectId}`);
      setTasks(res.data.data || []);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => { fetchProjects(); }, []);
  useEffect(() => { if (selectedProject) fetchTodos(selectedProject._id); }, [selectedProject]);

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${api}/projects`, newProject);
      setNewProject({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${api}/projects/${editProject._id}`, editProject);
      fetchProjects();
      setEditProject(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`${api}/projects/${id}`);
      fetchProjects();
      if (selectedProject?._id === id) {
        setSelectedProject(null);
        setTasks([]);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${api}/todos`, { ...newTodo, projectId: selectedProject._id });
      setNewTodo({ title: "", description: "", status: "" });
      fetchTodos(selectedProject._id);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${api}/todos/${editTodo._id}`, editTodo);
      fetchTodos(selectedProject._id);
      setEditTodo(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;
    try {
      await axios.delete(`${api}/todos/${id}`);
      fetchTodos(selectedProject._id);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-2 border-end">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Projects</h6>
            <button className="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#addProjectModal">+</button>
          </div>

          {projects.map((p) => (
            <div key={p._id} className="d-flex align-items-center mb-2">
              <button
                className={`btn flex-grow-1 ${selectedProject?._id === p._id ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setSelectedProject(p)}
                title={p.description}
              >
                {p.name}
              </button>
              <div className="dropdown ms-1">
                <button className="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown">⋮</button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" onClick={() => setEditProject(p)} data-bs-toggle="modal" data-bs-target="#editProjectModal">Edit</button>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={() => handleDeleteProject(p._id)}>Delete</button>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="col-10">
          {selectedProject ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>{selectedProject.name}</h5>
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTodoModal">Add Todo</button>
              </div>

              <div className="row g-3">
                {columns.map((col) => {
                  const colTasks = tasks.filter((t) => t.status === col.key);
                  return (
                    <div className="col" key={col.key}>
                      <h6>{col.title} <span className="badge bg-secondary">{colTasks.length}</span></h6>
                      {colTasks.map((task) => (
                        <div key={task._id} className="card mb-3 shadow-sm">
                          <div className="card-body p-2">
                            <div className="d-flex justify-content-between">
                              <h6 className="card-title mb-1">{task.title}</h6>
                              <div className="dropdown">
                                <button className="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown">⋮</button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button className="dropdown-item" onClick={() => setEditTodo(task)} data-bs-toggle="modal" data-bs-target="#editTodoModal">Edit</button>
                                  </li>
                                  <li>
                                    <button className="dropdown-item text-danger" onClick={() => handleDeleteTodo(task._id)}>Delete</button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <p className="card-text small">{task.description}</p>
                            <span className="badge bg-light text-primary">
                              Task {tasks.findIndex(t => t._id === task._id) + 1}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          ) : <p>Select a project</p>}
        </div>
      </div>

      {/* add project modal */}
      <div className="modal fade" id="addProjectModal" tabIndex="-1">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleAddProject}>
            <div className="modal-header">
              <h5 className="modal-title">Add Project</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input className="form-control mb-2" placeholder="Project Name" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} required />
              <textarea className="form-control" placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}></textarea>
            </div>
            <div className="modal-footer"><button type="submit" className="btn btn-primary">Save</button></div>
          </form>
        </div>
      </div>

      {/* update project modal */}
      <div className="modal fade" id="editProjectModal" tabIndex="-1">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleUpdateProject}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Project</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input className="form-control mb-2" placeholder="Project Name" value={editProject?.name || ""} onChange={(e) => setEditProject({ ...editProject, name: e.target.value })} required />
              <textarea className="form-control" placeholder="Description" value={editProject?.description || ""} onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}></textarea>
            </div>
            <div className="modal-footer"><button type="submit" className="btn btn-primary">Update</button></div>
          </form>
        </div>
      </div>

      {/* add todo modal */}
      <div className="modal fade" id="addTodoModal" tabIndex="-1">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleAddTodo}>
            <div className="modal-header"><h5 className="modal-title">Add Todo</h5><button type="button" className="btn-close" data-bs-dismiss="modal"></button></div>
            <div className="modal-body">
              <input className="form-control mb-2" placeholder="Todo Title" value={newTodo.title} onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })} required />
              <textarea className="form-control mb-2" placeholder="Description" value={newTodo.description} onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}></textarea>

            </div>
            <div className="modal-footer"><button type="submit" className="btn btn-primary">Save</button></div>
          </form>
        </div>
      </div>

      {/* update todo modal */}
      <div className="modal fade" id="editTodoModal" tabIndex="-1">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleUpdateTodo}>
            <div className="modal-header"><h5 className="modal-title">Edit Todo</h5><button type="button" className="btn-close" data-bs-dismiss="modal"></button></div>
            <div className="modal-body">
              <input className="form-control mb-2" placeholder="Todo Title" value={editTodo?.title || ""} onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })} required />
              <textarea className="form-control mb-2" placeholder="Description" value={editTodo?.description || ""} onChange={(e) => setEditTodo({ ...editTodo, description: e.target.value })}></textarea>
              <select className="form-select" value={editTodo?.status} onChange={(e) => setEditTodo({ ...editTodo, status: e.target.value })}>
                <option value="requested">Requested</option>
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="modal-footer"><button type="submit" className="btn btn-primary">Update</button></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MockApi;
