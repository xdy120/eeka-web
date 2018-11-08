import RestApi from '@/libs/restapi';

class MemberApi extends RestApi {
  static get baseUrl() {
    return '/marketing/member';
  }
}

export {MemberApi};