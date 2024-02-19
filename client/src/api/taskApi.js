import axiosClient from "./axiosClient";

const taskApi = {
  create: (boardId, params) =>
    axiosClient.post(`board/${boardId}/tasks`, params),
  updatePosition: (boardId, params) =>
    axiosClient.put(`board/${boardId}/tasks/update-position`, params),
  delete: (boardId, taskId) =>
    axiosClient.delete(`board/${boardId}/tasks/${taskId}`),
  update: (boardId, taskId, params) =>
    axiosClient.put(`board/${boardId}/tasks/${taskId}`, params),
};

export default taskApi;
