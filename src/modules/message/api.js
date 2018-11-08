import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class MessageApi extends RestApi {
  static get baseUrl() {
    return '/message';
  }

  static countUnread(){
    return ajax.get(`${this.baseUrl}/countUnread`);
  }

  static markRead(messageId){
    return ajax.put(`${this.baseUrl}/${messageId}/markRead`);
  }
}

export {MessageApi};