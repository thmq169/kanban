import axiosClient from "./axiosClient";

const boardApi = {
  create: () => axiosClient.post("board"),
  getAll: () => axiosClient.get("board"),
  updatePosition: (params) => axiosClient.put("board", params),
  getOne: (id) => axiosClient.get(`board/${id}`),
  deleteBoard: (id) => axiosClient.delete(`board/${id}`),
  update: (id, params) => axiosClient.put(`board/${id}`, params),
  getFavorites: () => axiosClient.get("board/favorites"),
  updateFavoritePosition: (params) =>
    axiosClient.put("board/favorites", params),
};

export default boardApi;
