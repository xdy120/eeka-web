import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class JobApi extends RestApi {
  static get baseUrl() {
    return '/job';
  }

  static cancel(jobId) {
    return ajax.put(`${this.baseUrl}/${jobId}/cancel`);
  }
}

export {JobApi};