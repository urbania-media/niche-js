class BaseResource {
    constructor(api, resource) {
        this.api = api;
        this.resource = resource;
    }

    resourceRoute(resource, route, params = {}) {
        const { id = null } = params || {};
        const { id: resourceId = null, hasRoutes = false } = resource || {};
        const routePrefix = hasRoutes ? `resources.${resourceId}` : resourceId;
        return hasRoutes
            ? this.api.route(`${routePrefix}.${route}`, { ...params, id })
            : `${routePrefix}${id !== null ? `/${id}` : ''}`;
    }

    find(id) {
        return this.api.requestGet(
            this.resourceRoute(this.resource, 'show', {
                id,
            }),
            null,
            {
                withCredentials: true,
            },
        );
    }

    get(query = {}, page = 1, count = 10) {
        const finalQuery = {
            ...query,
        };
        if (page !== null) {
            finalQuery.page = page;
        }
        if (count !== null) {
            finalQuery.count = count;
        }
        return this.api.requestGet(this.resourceRoute(this.resource, 'index'), finalQuery, {
            withCredentials: true,
        });
    }

    store(data) {
        return this.api.requestPost(this.resourceRoute(this.resource, 'store'), data, {
            withCredentials: true,
        });
    }

    update(id, data) {
        return this.api.requestPatch(
            this.resourceRoute(this.resource, 'update', {
                id,
            }),
            data,
            {
                withCredentials: true,
            },
        );
    }

    destroy(id) {
        return this.api.requestDelete(
            this.resourceRoute(this.resource, 'destroy', {
                id,
            }),
            null,
            {
                withCredentials: true,
            },
        );
    }
}

export default BaseResource;
