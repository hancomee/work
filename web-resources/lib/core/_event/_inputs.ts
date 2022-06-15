import {Events} from "../_events";


export namespace InputEvent {

    export function __$onlyNumber(input: HTMLInputElement | HTMLTextAreaElement) {
        return new Events(input, 'keyup', () => {
            let {value} = input, flag = value[0] === '-' ? '-' : '';
            value = value.replace(/[^\d]/g, '');
            input.value = flag + value;
        })
    }
}