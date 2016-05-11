export interface PropOption {
    type?: { new (...args: any[]): any; } | { new (...args: any[]): any; }[];
    required?: boolean;
    default?: any;
    twoWay?: boolean;
    validator?(value: any): boolean;
    coerce?(value: any): any;
}

export interface WatchOption {
    handler(val: any, oldVal: any): void;
    deep?: boolean;
    immidiate?: boolean;
}

export interface DirectiveOption {
    bind?(): any;
    update?(newVal?: any, oldVal?: any): any;
    unbind?(): any;
    params?: string[];
    deep?: boolean;
    twoWay?: boolean;
    acceptStatement?: boolean;
    priority?: boolean;
    [key: string]: any;
}

export interface FilterOption {
    read?: Function;
    write?: Function;
}

export interface TransitionOption {
    css?: boolean;
    animation?: string;
    enterClass?: string;
    leaveClass?: string;
    beforeEnter?(el: HTMLElement): void;
    enter?(el: HTMLElement, done?: () => void): void;
    afterEnter?(el: HTMLElement): void;
    enterCancelled?(el: HTMLElement): void;
    beforeLeave?(el: HTMLElement): void;
    leave?(el: HTMLElement, done?: () => void): void;
    afterLeave?(el: HTMLElement): void;
    leaveCancelled?(el: HTMLElement): void;
    stagger?(index: number): number;
    enterStagger?(index: number): number;
    leaveStagger?(index: number): number;
    [key: string]: any;
}

export interface ComponentOption {
    data?(): {[key: string]: any};
    props?: string[] | { [key: string]: (PropOption | { new (...args: any[]): any; }) };
    watch?: { [key: string]: ((val: any, oldVal: any) => void) | string | WatchOption };
    el?: string | HTMLElement | (() => HTMLElement);
    template?: string;
    replace?: boolean;
    directives?: { [key: string]: (DirectiveOption | Function) };
    elementDirectives?: { [key: string]: (DirectiveOption | Function) };
    filters?: { [key: string]: (Function | FilterOption) };
    components?: { [key: string]: any };
    transitions?: { [key: string]: TransitionOption };
    partials?: { [key: string]: string };
    parent?: any;
    events?: { [key: string]: ((...args: any[]) => (boolean | void)) | string };
    mixins?: any[];
    name?: string;
    [key: string]: any;
}

export default function(options: ComponentOption): ClassDecorator;
