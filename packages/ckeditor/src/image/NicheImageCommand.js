import { Command } from 'ckeditor5/src/core';

export default class NicheImageCommand extends Command {
    refresh() {
        const { editor } = this;
        const imageUtils = editor.plugins.get('ImageUtils');
        const selectedElement = editor.model.document.selection.getSelectedElement();

        // TODO: This needs refactoring.
        this.isEnabled = imageUtils.isImageAllowed() || imageUtils.isImage(selectedElement);
    }

    execute() {
        const { selection } = this.editor.model.document;
        const imageUtils = this.editor.plugins.get('ImageUtils');
        const selectedElement = selection.getSelectedElement();

        if (this.editor.onRequestImageChange && imageUtils.isImage(selectedElement)) {
            const selectionAttributes = Object.fromEntries(selection.getAttributes());
            // const position = this.editor.model.createPositionAfter(selectedElement);
            this.editor.onRequestImageChange((newFile) =>
                this.replaceImage(newFile, selectionAttributes),
            );
        }

        // In case of multiple files, each file (starting from the 2nd) will be inserted at a position that
        // follows the previous one. That will move the selection and, to stay on the safe side and make sure
        // all images inherit the same selection attributes, they are collected beforehand.
        //
        // Applying these attributes ensures, for instance, that inserting an (inline) image into a link does
        // not split that link but preserves its continuity.
        //
        // Note: Selection attributes that do not make sense for images will be filtered out by insertImage() anyway.
        // const selectionAttributes = Object.fromEntries(selection.getAttributes());

        // files.forEach((file, index) => {
        //     const selectedElement = selection.getSelectedElement();

        //     // Inserting of an inline image replace the selected element and make a selection on the inserted image.
        //     // Therefore inserting multiple inline images requires creating position after each element.
        //     if (index && selectedElement && imageUtils.isImage(selectedElement)) {
        //         const position = this.editor.model.createPositionAfter(selectedElement);

        //         this._uploadImage(file, selectionAttributes, position);
        //     } else {
        //         this._uploadImage(file, selectionAttributes);
        //     }
        // });
    }

    replaceImage(file = null, attributes = null, position = null) {
        const { editor } = this;
        const imageUtils = editor.plugins.get('ImageUtils');
        console.log('yo! replaceImage', file);

        if (file !== null) {
            imageUtils.insertImage({ ...attributes, uploadId: file.id }, position);
        } else {
            imageUtils.insertImage({ ...attributes }, position);
        }
    }

    /**
     * Handles uploading single file.
     */
    // _uploadImage(file, attributes, position) {
    //     const { editor } = this;
    //     const fileRepository = editor.plugins.get(FileRepository);
    //     const loader = fileRepository.createLoader(file);
    //     const imageUtils = editor.plugins.get('ImageUtils');

    //     // Do not throw when upload adapter is not set. FileRepository will log an error anyway.
    //     if (!loader) {
    //         return;
    //     }

    //     imageUtils.insertImage({ ...attributes, uploadId: loader.id }, position);
    // }
}
