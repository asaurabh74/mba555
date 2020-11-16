import { Injectable } from '@angular/core';

import { PropertyResolver } from '../../core/services/property-resolver';

@Injectable()
export class FilterService {

    constructor() { }

    filter<T>(items: T[], data: string, props: string[]) {
        return items.filter((item: T) => {
            let match = false;
            for (const prop of props) {
                if (prop.indexOf('.') > -1) {
                   const value = PropertyResolver.resolve(prop, item);
                   if (value && value.toUpperCase().indexOf(data) > -1) {
                      match = true;
                      break;
                   }
                   continue;
                }
                var itemProp = item[prop];
                if (Array.isArray(itemProp) && itemProp.length > 0) {
                    itemProp = itemProp[0];
                }
                if (itemProp && itemProp.value !== "") {
                    itemProp = itemProp.value;
                }
                if (itemProp && itemProp.toString().toUpperCase().indexOf(data) > -1) {
                  match = true;
                  break;
                }
            }
            return match;
        });
    }

}
