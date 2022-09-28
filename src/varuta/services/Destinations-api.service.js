import http from '../../core/services/http-common';

export class DestinationsApiService {
    getAll() {
        return http.get('/Destinations');
    }

    getById(id) {
        return http.get(`/Destinations/${id}`);
    }

    create(data) {
        return http.post('/Destinations', data);
    }

    update(id, data) {
        return http.put(`/Destinations/${id}`, data);
    }

    delete(id) {
        return http.delete(`/Destinations/${id}`);
    }

    findByName(name) {
        return http.get(`/Destinations?name=${name}`);
    }
}
