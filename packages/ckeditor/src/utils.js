export function findElement(element, matcher) {
    const match = matcher(element);
    if (match === true) {
        return element;
    }

    if (typeof element.parent !== 'undefined' && element.parent !== null) {
        return findElement(element.parent, matcher);
    }

    return null;
}

export function findElementFromAttributes(element, attributes) {
    return findElement(element, (el) => {
        const elKeys = typeof el.getAttributeKeys !== 'undefined' ? [...el.getAttributeKeys()] : [];
        return (
            elKeys.findIndex(
                (it) => attributes.findIndex((attribute) => it.match(attribute) !== null) !== -1,
            ) !== -1
        );
    });
}

export function createNicheViewAttributes(
    element,
    attributes = ['widget', 'id', 'uuid', 'type', 'role', 'platform'],
) {
    return attributes.reduce(
        (map, attribute) => ({
            ...map,
            [`data-niche-${attribute}`]: element.getAttribute(attribute) || null,
        }),
        {},
    );
}

export function createNicheModelAttributes(
    element,
    attributes = ['widget', 'id', 'uuid', 'type', 'role', 'platform'],
) {
    return attributes.reduce(
        (map, attribute) => ({
            ...map,
            [attribute]: element.getAttribute(`data-niche-${attribute}`) || null,
        }),
        {},
    );
}

export function getElementAttributes(element) {
    return typeof element.getAttributeKeys !== 'undefined'
        ? [...element.getAttributeKeys()].reduce(
              (map, key) => ({
                  ...map,
                  [key]: element.getAttribute(key),
              }),
              {},
          )
        : {};
}

export function createNicheUiFromView(modelWriter, viewElement) {
    if (viewElement.is('text')) {
        return modelWriter.createElement('nicheUi', {
            tag: 'text',
            text: viewElement.data,
        });
    }

    const attributes = getElementAttributes(viewElement);

    const children =
        typeof viewElement.getChildren !== 'undefined' ? [...viewElement.getChildren()] : [];

    const childrenAreTexts =
        children.length > 0
            ? children.reduce((allTexts, node) => allTexts && node.is('text'), true)
            : false;

    const modelElement = modelWriter.createElement(
        'nicheUi',
        {
            tag: viewElement.name,
            attributes: JSON.stringify(attributes),
            ...(childrenAreTexts
                ? {
                      texts: JSON.stringify(children.map((it) => it.data)),
                  }
                : null),
        },
    );

    return modelElement;
}

export function createViewFromNicheUi(viewWriter, modelElement) {
    if (modelElement.is('text')) {
        return viewWriter.createText(modelElement.data);
    }

    const tag = modelElement.getAttribute('tag');
    if (tag === 'text') {
        return viewWriter.createText(modelElement.getAttribute('text'));
    }

    const texts = JSON.parse(modelElement.getAttribute('texts') || '[]');

    if (texts.length > 0) {
        const element = viewWriter.createRawElement(
            tag,
            JSON.parse(modelElement.getAttribute('attributes') || '{}'),
            (domElement) => {
                // eslint-disable-next-line no-param-reassign
                domElement.innerText = texts.join('\n');
            },
        );

        return element;
    }
    const element = viewWriter.createContainerElement(
        tag,
        JSON.parse(modelElement.getAttribute('attributes') || '{}'),
    );

    return element;
}
