import Base from './Base';
import BaseResource from './BaseResource';
import MediasApi from './Medias';

class Api extends Base {
    constructor(opts = {}) {
        super(opts);
        this.medias = new MediasApi(opts);
        this.categories = new BaseResource(this, { id: 'categories' });
        this.authors = new BaseResource(this, { id: 'authors' });
        this.organisations = new BaseResource(this, { id: 'organisations' });
        this.tags = new BaseResource(this, { id: 'tags' });
        this.collections = new BaseResource(this, { id: 'collections' });
    }
}

export default Api;
