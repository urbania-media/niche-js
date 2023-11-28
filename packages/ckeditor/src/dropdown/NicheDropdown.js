import { Plugin } from '@ckeditor/ckeditor5-core';

import NicheDropdownEditing from './NicheDropdownEditing';
import NicheDropdownUI from './NicheDropdownUI';

export default class NicheDropdown extends Plugin {
    static get requires() {
        return [NicheDropdownEditing, NicheDropdownUI];
    }
}
