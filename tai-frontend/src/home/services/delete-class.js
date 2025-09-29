import api from "../../shared/services/axios";

export const deleteClass = (classId) => { 
    return api.delete(`/classroom/${classId}`);
};