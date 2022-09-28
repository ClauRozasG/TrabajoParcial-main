import http from '../../core/services/http-common';

export class SendersApiService {
    getAll() {
        return http.get('/Senders');
    }

    getById(id) {
        return http.get(`/Senders/${id}`);
    }

    create(data) {
        return http.post('/Senders', data);
    }

    update(id, data) {
        return http.put(`/Senders/${id}`, data);
    }

    delete(id) {
        return http.delete(`/Senders/${id}`);
    }

    findByName(name) {
        return http.get(`/Senders?name=${name}`);
    }
}