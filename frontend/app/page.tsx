"use client";

import { createTask, getTasks, updateTask, deleteTask } from '@/lib/api';
import { useState, useEffect } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null); 
  
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  async function loadTasks() {
    const data = await getTasks();
    setTasks(data.data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const openModal = (taskToEdit: any = null) => {
    if (taskToEdit) {
      setIsEditMode(true);
      setCurrentTaskId(taskToEdit.id);
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
    } else {
      setIsEditMode(false);
      setCurrentTaskId(null);
      setTitle("");
      setDescription("");
      setStatus("pending");
      setPriority("medium");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        setIsEditMode(false);
        setCurrentTaskId(null);
        setTitle("");
        setDescription("");
    }, 300);
  };

  async function handleSubmit(e: any) {
    e.preventDefault();

    const taskData = {
        title,
        description,
        status,
        priority,
    };

    try {
      if (isEditMode && currentTaskId) {
        await updateTask(currentTaskId, taskData);
        showToast('Tarefa atualizada com sucesso!');
      } else {
        await createTask(taskData);
        showToast('Tarefa criada com sucesso!');
      }

      loadTasks();
      closeModal();
      
    } catch (error) {
      console.error("Erro ao salvar task:", error);
    }
  }

  const showToast = (message: string) => {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 transition-opacity duration-300 opacity-0 transform translate-y-2';
      toast.innerText = message;
      document.body.appendChild(toast);
      
      requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-y-2');
      });

      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
      }, 3000);
  };

  const handleDragStart = (e: React.DragEvent, task: any) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      const updatedTasks = tasks.map((task) =>
        task.id === draggedTask.id ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);

      try {
        await updateTask(draggedTask.id, { status: newStatus });
      } catch (error) {
        console.error("Erro ao atualizar task:", error);
        loadTasks();
      }
    }
    setDraggedTask(null);
  };

  const handleDelete = async (taskId: number) => {
    setTaskToDelete(taskId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete);
        loadTasks();
        setDeleteModalOpen(false);
        setTaskToDelete(null);
      } catch (error) {
        console.error("Erro ao deletar task:", error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  return (
    <main className="p-10 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Gerenciador de Tarefas</h1>
            <button
                onClick={() => openModal()}
                className="bg-gray-800 hover:bg-gray-900 transition-colors text-white px-6 py-3 rounded-lg font-medium shadow-md flex items-center gap-2"
            >
                <span>+</span> Adicionar Tarefa
            </button>
        </header>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative transform transition-all scale-100 border border-gray-100">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                onClick={closeModal}
              >
                ✕
              </button>
              
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                {isEditMode ? 'Editar Tarefa' : 'Nova Tarefa'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                    type="text"
                    placeholder="Ex: Reunião de equipe"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all"
                    required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input
                    type="text"
                    placeholder="Detalhes da tarefa..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all"
                    required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                        required
                        >
                        <option value="pending">Pendente</option>
                        <option value="in_progress">Em Progresso</option>
                        <option value="completed">Concluída</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                        <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                        required
                        >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                        </select>
                    </div>
                </div>

                <button className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95 mt-4">
                  {isEditMode ? 'Salvar Alterações' : 'Criar Tarefa'}
                </button>
              </form>
            </div>
          </div>
        )}

        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative overflow-hidden">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <span className="text-2xl">⚠️</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Confirmar Exclusão
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Tem certeza que deseja deletar esta tarefa? Esta ação é irreversível.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={cancelDelete}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm font-medium"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div
            className="flex-1 bg-gray-100/80 p-5 rounded-2xl min-h-[500px] border border-gray-200"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "pending")}
          >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-700">Pendente</h2>
                <span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full font-bold">
                    {tasks.filter((t) => t.status === "pending").length}
                </span>
            </div>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === "pending")
                .map((task) => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        onDragStart={handleDragStart} 
                        onDelete={handleDelete}
                        onEdit={openModal}
                    />
                ))}
            </div>
          </div>


          <div
            className="flex-1 bg-gray-100/80 p-5 rounded-2xl min-h-[500px] border border-gray-200"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "in_progress")}
          >
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-700">Em Progresso</h2>
                <span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full font-bold">
                    {tasks.filter((t) => t.status === "in_progress").length}
                </span>
            </div>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === "in_progress")
                .map((task) => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        onDragStart={handleDragStart} 
                        onDelete={handleDelete}
                        onEdit={openModal}
                    />
                ))}
            </div>
          </div>

          <div
            className="flex-1 bg-gray-100/80 p-5 rounded-2xl min-h-[500px] border border-gray-200"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "completed")}
          >
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-700">Concluída</h2>
                <span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full font-bold">
                    {tasks.filter((t) => t.status === "completed").length}
                </span>
            </div>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === "completed")
                .map((task) => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        onDragStart={handleDragStart} 
                        onDelete={handleDelete}
                        onEdit={openModal}
                    />
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function TaskCard({ task, onDragStart, onDelete, onEdit }: any) {
    const priorityColors = {
        low: "bg-gray-100 text-gray-600",
        medium: "bg-orange-100 text-orange-700",
        high: "bg-red-100 text-red-700"
    };

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, task)}
            className="bg-white p-4 rounded-xl shadow-sm border border-transparent hover:border-gray-200 cursor-move hover:shadow-md transition-all relative group"
        >
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 mb-1">{task.title}</h3>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task);
                        }}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar tarefa"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Deletar tarefa"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {task.description}
            </p>
            <div className="flex items-center justify-start mt-2">
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${priorityColors[task.priority as keyof typeof priorityColors] || 'bg-gray-100'}`}>
                    {task.priority === "low" ? "Baixa" : task.priority === "medium" ? "Média" : "Alta"}
                </span>
            </div>
        </div>
    );
}