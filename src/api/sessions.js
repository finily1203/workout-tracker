import axios from "axios";
import { API_URL } from "../aws-config";

export const createSession = (data) =>
    axios.post(`${API_URL}/sessions`, data);

export const getSessions = (userId) =>
    axios.get(`${API_URL}/sessions`, { params: { userId } });

export const getSession = (userId, sessionId) =>
    axios.get(`${API_URL}/sessions/${sessionId}`, { params: { userId } });

export const updateSession = (data) =>
    axios.put(`${API_URL}/sessions/${data.sessionId}`, data);

export const deleteSession = (userId, sessionId) =>
    axios.delete(`${API_URL}/sessions/${sessionId}`, { data: { userId, sessionId } });