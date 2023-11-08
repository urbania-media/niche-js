import { icons } from '@ckeditor/ckeditor5-core';
import { Template } from '@ckeditor/ckeditor5-ui';
import {
    WidgetTypeAround as BaseWidgetTypeAround,
    isTypeAroundWidget,
} from '@ckeditor/ckeditor5-widget';

const POSSIBLE_INSERTION_POSITIONS = ['before', 'after'];

const icon = icons.cancel;

const RETURN_ARROW_ICON_ELEMENT =
    new DOMParser().parseFromString(icon, 'image/svg+xml').firstChild !== null;

function injectButtons(wrapperDomElement, buttonTitles) {
    POSSIBLE_INSERTION_POSITIONS.forEach((position) => {
        const buttonTemplate = new Template({
            tag: 'div',
            attributes: {
                class: [
                    'ck',
                    'ck-widget__type-around__button',
                    `ck-widget__type-around__button_${position}`,
                ],
                title: buttonTitles[position],
                'aria-hidden': 'true',
            },
            children: [wrapperDomElement.ownerDocument.importNode(RETURN_ARROW_ICON_ELEMENT, true)],
        });
        wrapperDomElement.appendChild(buttonTemplate.render());
    });
}

function injectFakeCaret(wrapperDomElement) {
    const caretTemplate = new Template({
        tag: 'div',
        attributes: {
            class: ['ck', 'ck-widget__type-around__fake-caret'],
        },
    });

    wrapperDomElement.appendChild(caretTemplate.render());
}

function injectUIIntoWidget(viewWriter, buttonTitles, widgetViewElement) {
    const typeAroundWrapper = viewWriter.createUIElement(
        'div',
        {
            class: 'ck ck-reset_all ck-widget__type-around',
        },
        (domDocument) => {
            const wrapperDomElement = this.toDomElement(domDocument);
            injectButtons(wrapperDomElement, buttonTitles);
            injectFakeCaret(wrapperDomElement);
            return wrapperDomElement;
        },
    );

    // Inject the type around wrapper into the widget's wrapper.
    viewWriter.insert(viewWriter.createPositionAt(widgetViewElement, 'end'), typeAroundWrapper);
}

export default class WidgetTypeAround extends BaseWidgetTypeAround {
    // eslint-disable-next-line no-underscore-dangle
    _enableTypeAroundUIInjection() {
        const { editor } = this;
        const { schema } = editor.model;
        const { t } = editor.locale;
        const buttonTitles = {
            before: t('Insert paragraph before blockkkk'),
            after: t('Insert paragraph after block'),
        };

        editor.editing.downcastDispatcher.on(
            'insert',
            (evt, data, conversionApi) => {
                const viewElement = conversionApi.mapper.toViewElement(data.item) || null;

                if (!viewElement) {
                    return;
                }

                // Filter out non-widgets and inline widgets.
                if (isTypeAroundWidget(viewElement, data.item, schema)) {
                    injectUIIntoWidget(conversionApi.writer, buttonTitles, viewElement !== null);

                    const widgetLabel = viewElement.getCustomProperty('widgetLabel');

                    widgetLabel.push(() =>
                        this.isEnabled
                            ? t(
                                  'Press Enter to type after or press Shift + Enter to type before the widget',
                              )
                            : '',
                    );
                }
            },
            { priority: 'low' },
        );
    }
}
