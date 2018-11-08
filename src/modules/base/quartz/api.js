import {quartzAxiosWapper} from '@/libs/ajax';

class QuartzApi {
  static get baseUrl() {
    return '/quartz';
  }

  static list() {
    return quartzAxiosWapper.get(this.baseUrl + '/jobs');
  }

  static get(jobGroup, jobName) {
    return quartzAxiosWapper.get(this.baseUrl + '/' + jobGroup + '/' + jobName);
  }

  static add(entity) {
    return quartzAxiosWapper.post(this.baseUrl, entity);
  }

  static modify(oldJobGroup, oldJobName, entity) {
    return quartzAxiosWapper.put(this.baseUrl + '/' + oldJobGroup + '/' + oldJobName, entity);
  }

  static pause(jobGroup, jobName) {
    return quartzAxiosWapper.post(
      this.baseUrl + '/' + jobGroup + '/' + jobName + '/pause');
  }

  static continue(jobGroup, jobName) {
    return quartzAxiosWapper.post(
      this.baseUrl + '/' + jobGroup + '/' + jobName + '/continue');
  }

  static delete(jobGroup, jobName) {
    return quartzAxiosWapper.post(
      this.baseUrl + '/' + jobGroup + '/' + jobName + '/delete');
  }
}

export {
  QuartzApi
};
