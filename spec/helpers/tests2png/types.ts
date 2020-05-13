import { Observable } from "rxjs";

export declare type TestObservableLike<T> = Observable<T> & {
    subscriptions: any[];
    messages: any
};


export interface TestStream {
    messages: TestMessage[];
    cold?: TestObservableLike<any>;
    subscription?: {
        start: number;
        end: string | number;
    };
    isGhost?: boolean;
}

export type MarbleContent = string[] | boolean | string | object;

export interface GMObject {
    size: (cb: Function) => GMObject;
    format: (cb: Function) => GMObject;
    depth: (cb: Function) => GMObject;
    color: (cb: Function) => GMObject;
    res: (cb: Function) => GMObject;
    filesize: (cb: Function) => GMObject;
    identify: (cb: Function) => GMObject;
    orientation: (cb: Function) => GMObject;

    draw: Function;
    drawArc: Function;
    drawBezier: Function;
    drawCircle: Function;
    drawEllipse: Function;
    drawLine: Function;
    drawPoint: Function;
    drawPolygon: Function;
    drawPolyline: Function;
    drawRectangle: Function;
    drawText: Function;
    fill: Function;
    font: Function;
    fontSize: Function;
    stroke: Function;
    strokeWidth: Function;
    setDraw: Function;
    write: Function;
}

export interface TestMessage {
    notification: {
        value: any;
        kind: string;
    };
    isGhost?: boolean;
    frame: number;
}
