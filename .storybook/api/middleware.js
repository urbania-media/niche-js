import fs from 'fs';
import path from 'path';

import { getJSON } from '@folklore/fetch';
import dayjs from 'dayjs';
import express from 'express';
import { sync as globSync } from 'glob';
import _ from 'lodash';
import queryString from 'query-string';

const endpoint = 'https://v2.urbania.ca/api';

const cache = {};

const resources = {
    authors: (response) => {
        const { data } = response || {};
        return (data || []).map((it) => ({ ...it, label: it.name, value: it.id }));
    },
    organisations: (response) => {
        const { data } = response || {};
        return (data || []).map((it) => ({ ...it, label: it.name, value: it.id }));
    },
    categories: (response) => {
        const { data } = response || {};
        return (data || []).map((it) => ({ ...it, label: it.label, value: it.id }));
    },
    tags: (response) => {
        const { data } = response || {};
        return (data || []).map((it) => ({ ...it, label: it.label, value: it.id }));
    },
    collections: (response) => {
        const { data } = response || {};
        return (data || []).map((it) => ({ ...it, label: it.title, value: it.id }));
    },
};

export default () => {
    const router = express.Router();

    router.use(express.json());
    router.use(express.urlencoded());

    const dataPath = path.join(__dirname, '/data');

    const resourceExists = (resource) => fs.existsSync(path.join(dataPath, resource));

    const updatedResources = {};
    const deletedResources = {};

    async function getResourceItems(resource, page = null, count = null, query = null) {
        const hasEndpoint = (resources[resource] || null) !== null;

        let items = null;

        if (hasEndpoint) {
            const finalQuery = { page, count, ...query };
            const url = `${endpoint}/${resource}?${queryString.stringify(finalQuery)}`;
            console.log(url, 'cached', typeof cache[url] !== 'undefined');
            if (typeof cache[url] !== 'undefined') {
                items = cache[url];
            } else {
                items = await getJSON(url)
                    .then(resources[resource])
                    .catch((err) => {
                        console.log('error', err);
                        return [];
                    });
                cache[url] = items;
            }
        } else if (typeof cache[resource] !== 'undefined') {
            items = cache[resource];
        } else {
            items = globSync(path.join(dataPath, `${resource}/*.{js,json}`)).map((filePath) =>
                filePath.match(/\.json$/)
                    ? JSON.parse(fs.readFileSync(filePath))
                    : require(filePath),
            );
            cache[resource] = items;
        }

        const updatedItems = updatedResources[resource] || [];
        const deletedItems = deletedResources[resource] || [];
        const updatedResourcesIds = updatedItems.map((it) => it.id);

        const finalItems = items.filter(
            (it) => updatedResourcesIds.indexOf(it.id) === -1 && deletedItems.indexOf(it.id) === -1,
        );
        return [...finalItems, ...updatedItems];
    }

    const getItemsPage = (items, page, count) => {
        const startIndex = (page - 1) * count;
        const endIndex = startIndex + count;
        const total = items.length;
        const lastPage = Math.ceil(total / count);
        return {
            pagination: { current_page: page, last_page: lastPage, page, lastPage, total, count },
            data: items.slice(startIndex, endIndex),
        };
    };

    const sortItems = (items, field = null, direction = 'asc') => {
        if (field === null) {
            return items;
        }
        const sortedItems = _.sortBy(items, field);
        return direction.toLowerCase() === 'desc' ? _.reverse(sortedItems) : sortedItems;
    };

    const filterItems = (resource, items, query = null) => {
        const hasEndpoint = (resources[resource] || null) !== null;
        if (hasEndpoint || query === null || Object.keys(query).length === 0) {
            return items;
        }

        // console.log('items', items, 'query', query);
        const { source, search = null, ...queryWithoutSource } = query;
        if (search !== null) {
            return _.values(
                _.filter(items, (it) => {
                    const searchVal =
                        it !== null ? it?.title || it?.label || it?.name || null : null;
                    return searchVal !== null ? searchVal.indexOf(search) !== -1 : false;
                }),
            );
        }
        return _.values(_.filter(items, _.matches(queryWithoutSource)));
    };

    const getNextId = (items) =>
        items.reduce((nextId, { id }) => (parseInt(id, 10) >= nextId ? nextId + 1 : nextId), 1);

    const addResourceItem = (resource, item) => {
        if (typeof updatedResources[resource] === 'undefined') {
            updatedResources[resource] = [];
        }
        updatedResources[resource] = [...updatedResources[resource], item];
    };

    const updateResourceItem = (resource, newItem) => {
        if (typeof updatedResources[resource] === 'undefined') {
            updatedResources[resource] = [];
        }
        const foundResource =
            updatedResources[resource].find((it) => it.id === newItem.id) === null;
        if (foundResource === null) {
            addResourceItem(resource, newItem);
            return;
        }
        updatedResources[resource] = updatedResources[resource].map((it) =>
            it.id === newItem.id
                ? {
                      ...it,
                      ...newItem,
                  }
                : it,
        );
    };

    const deleteResourceItem = (resource, id) => {
        if (typeof deletedResources[resource] === 'undefined') {
            deletedResources[resource] = [];
        }
        deletedResources[resource] = [...deletedResources[resource], id];
    };

    router.use(
        '/',
        express.static(dataPath, {
            index: false,
            extensions: ['json'],
        }),
    );

    let loggedInUser = require(path.join(dataPath, '/me'));

    router.get('/auth/check', (req, res) => {
        res.json(loggedInUser);
        res.end();
    });

    router.post('/auth/login', (req, res) => {
        loggedInUser = require(path.join(dataPath, '/me'));
        res.json(loggedInUser);
        res.end();
    });

    router.post('/auth/logout', (req, res) => {
        loggedInUser = null;
        res.json(loggedInUser);
        res.end();
    });

    router.get('/csrf-cookie', (req, res) => {
        res.json(null);
        res.end();
    });

    /**
     * Resource index
     */
    router.get('/:resource', async (req, res) => {
        const { resource } = req.params;
        if (!resourceExists(resource)) {
            res.sendStatus(404);
            return;
        }
        const {
            page = null,
            count = 10,
            sort = 'id',
            sort_direction: sortDirection = 'asc',
            ...query
        } = req.query;
        console.log('q', query);
        const items = await getResourceItems(resource, page, count, query);
        const filteredItems = sortItems(filterItems(resource, items, query), sort, sortDirection);
        if (page !== null) {
            res.json(getItemsPage(filteredItems, parseInt(page, 10), parseInt(count, 10)));
        } else {
            res.json(count !== null ? filteredItems.slice(0, count - 1) : filteredItems);
        }
        res.end();
    });

    /**
     * Resource by slug
     */
    router.get('/:resource/:id', (req, res) => {
        const { resource } = req.params;
        if (!resourceExists(resource)) {
            res.sendStatus(404);
            return;
        }
        const { id: itemId } = req.params;
        const items = getResourceItems(resource);
        const item = items.find(({ id, slug = null }) => id === itemId || slug === itemId) || null;
        if (item === null) {
            res.sendStatus(404);
            return;
        }
        res.json(item);
        res.end();
    });

    /**
     * Resource store
     */
    router.post('/:resource', (req, res) => {
        const { resource } = req.params;
        if (!resourceExists(resource)) {
            res.sendStatus(404);
            return;
        }
        const currentItems = getResourceItems(resource);
        const nextId = getNextId(currentItems);
        const item = req.body;
        const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const newItem = {
            ...item,
            id: `${nextId}`,
            created_at: now,
            updated_at: now,
        };
        addResourceItem(resource, newItem);
        res.json(newItem);
        res.end();
    });

    const updateResource = (req, res) => {
        const { resource, id } = req.params;
        const currentItems = getResourceItems(resource);
        const currentItem = currentItems.find((it) => it.id === id) || null;
        if (currentItem === null) {
            res.sendStatus(404);
            return;
        }
        const { _method, ...item } = req.body;
        const newItem = {
            ...currentItem,
            ...item,
            updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
        updateResourceItem(resource, newItem);
        res.json(newItem);
        res.end();
    };

    const deleteResource = (req, res) => {
        const { resource, id } = req.params;
        const currentItems = getResourceItems(resource);
        const currentItem = currentItems.find((it) => it.id === id) || null;
        if (currentItem === null) {
            res.sendStatus(404);
            return;
        }
        deleteResourceItem(resource, id);
        res.json({ ...currentItem });
        res.end();
    };

    /**
     * Resource update
     */
    router.post('/:resource/:id', (req, res) => {
        const { resource } = req.params;
        if (!resourceExists(resource)) {
            res.sendStatus(404);
            return;
        }
        const { _method: methodOverride = null } = req.body;
        if (methodOverride !== null && methodOverride.toUpperCase() === 'DELETE') {
            deleteResource(req, res);
        } else {
            updateResource(req, res);
        }
    });

    /**
     * Resource delete
     */

    router.post('/:resource/requestDelete/:id', (req, res) => {
        const { resource, id } = req.params;
        if (!resourceExists(resource)) {
            res.sendStatus(404);
            return;
        }
        const currentItems = getResourceItems(resource);
        const currentItem = currentItems.find((it) => it.id === id) || null;
        if (currentItem === null) {
            res.sendStatus(404);
            return;
        }
        res.json({ ...currentItem });
        res.end();
    });

    router.delete('/:resource/:id', (req, res) => {
        const { resource } = req.params;
        if (!resourceExists(resource)) {
            res.sendStatus(404);
            return;
        }
        deleteResource(req, res);
    });

    return router;
};
