const API_URL = "http://127.0.0.1:8000/api";

export async function getTasks() {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Erro ao buscar tasks");
  }

  return response.json();
}

export async function createTask(data: any) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar task");
  }

  return response.json();
}

export async function updateTask(id: number, data: any) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar task");
  }

  return response.json();
}

export async function deleteTask(id: number) {
  const url = `${API_URL}/tasks/${id}`;
  console.log("Tentando deletar task:", url);
  
  const response = await fetch(url, {
    method: "DELETE",
  });

  console.log("Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro ao deletar task:", response.status, errorText);
    throw new Error(`Erro ao deletar task: ${response.status}`);
  }

  // DELETE pode retornar resposta vazia
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}
