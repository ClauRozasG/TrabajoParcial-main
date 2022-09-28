import http from '../../core/services/http-common';

export class ConsigneesApiService {
    getAll() {
        return http.get('/Consignees');
    }

    getById(id) {
        return http.get(`/Consignees/${id}`);
    }

    create(data) {
        return http.post('/Consignees', data);
    }

    update(id, data) {
        return http.put(`/Consignees/${id}`, data);
    }

    delete(id) {
        return http.delete(`/Consignees/${id}`);
    }

    findByName(name) {
        return http.get(`/Consignees?name=${name}`);
    }
}