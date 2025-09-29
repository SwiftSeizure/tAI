import api from "../../shared/services/axios";

export const postCreateDay = async (moduleId, dayName) => { 
    const url = `/module/${moduleId}/day`;
    await api.post(url, { name: dayName });
    return;
};
