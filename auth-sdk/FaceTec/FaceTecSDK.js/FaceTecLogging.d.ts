/**
 * Enum to allow developers to control FaceTec Browser SDK Logging behavior through the API FaceTecSDK.FaceTecLoggingMode
*/
export declare enum FaceTecLoggingMode {
    /**
    *   Log all important messages to the console.
    */
    Default = 0,
    /**
    *   Remove all logging except for when developing on Localhost
    */
    LocalhostOnly = 1
}
export declare var FaceTecLogging: {
    setFaceTecLoggingMode: (enumValue: FaceTecLoggingMode) => void;
};
