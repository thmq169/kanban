import axiosClient from "./axiosClient";

const sectionApi = {
  create: (boardId) => axiosClient.post(`board/${boardId}/sections`),
  update: (boardId, sectionId, params) =>
    axiosClient.put(`board/${boardId}/sections/${sectionId}`, params),
  delete: (boardId, sectionId) =>
    axiosClient.delete(`board/${boardId}/sections/${sectionId}`),
};

export default sectionApi;
