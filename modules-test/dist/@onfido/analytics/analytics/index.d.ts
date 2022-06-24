declare class AnalyticsService {
    network: undefined;
    options: {
        url: string;
    };
    constructor(props: any);
    dispatchToNetwork: (data: any) => void;
}
export declare class InhouseService extends AnalyticsService {
    options: {
        url: string;
    };
    dispatch: (data: any) => void;
}
export declare class WoopraService extends AnalyticsService {
    options: {
        url: string;
    };
    dispatch: (data: any) => void;
}
declare class AnalyticsInterface {
    services: {};
    options: {
        mapEvent: undefined;
    };
    constructor(props: any);
    dispatch: (eventData: any) => void;
}
export declare class Analytics extends AnalyticsInterface {
    sendEvent: (eventName: string, properties: Record<string, unknown>) => void;
    sendScreenEvent: (screenName: string, properties: Record<string, unknown>) => void;
}
export declare class ReactAnalytics {
    analytics: undefined;
    constructor(analytics: Analytics);
    trackComponent: (Component: any, screenName: string) => void;
    appendToTracking: (Component: any, ancestorScreenNameHierarchy: string) => void;
}
export {};
