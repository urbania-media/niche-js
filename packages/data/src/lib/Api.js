import Base from './Base';
import BaseResource from './BaseResource';
import MediasApi from './Medias';

class Api extends Base {
    constructor(opts = {}) {
        super(opts);
        this.medias = new MediasApi(opts);
        this.categories = new BaseResource(this, { id: 'categories' });
    }
}

export default Api;
