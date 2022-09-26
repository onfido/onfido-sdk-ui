/** Represents the options available for Audit Trail Images */
export declare enum FaceTecAuditTrailType {
    Disabled = 0,
    FullResolution = 1
}
export declare enum FaceTecRetryScreen {
    ShowStandardRetryScreenIfRejected = 0,
    ShowCameraFeedIssueScreenIfRejected = 1
}
/** Represents the status of the SDK */
export declare enum FaceTecSDKStatus {
    /**
     * Initialize was never attempted.
     */
    NeverInitialized = 0,
    /**
     * The Key provided was verified.
     */
    Initialized = 1,
    /**
     * The Key could not be verified due to connectivity issues on the user's device.
     */
    NetworkIssues = 2,
    /**
     * The Key provided was invalid.
     */
    InvalidDeviceKeyIdentifier = 3,
    /**
     * DEPRECATED
     */
    VersionDeprecated = 4,
    /**
     *  This device/platform/browser/version combination is not supported by the FaceTec Browser SDK.
     */
    DeviceNotSupported = 5,
    /**
     *  Device is in landscape display orientation. The FaceTec Browser SDK can only be used in portrait display orientation.
     */
    DeviceInLandscapeMode = 6,
    /**
     *  Device is in reverse portrait mode. The FaceTec Browser SDK can only be used in portrait display orientation.
     */
    DeviceLockedOut = 7,
    /**
      * The Key was expired, contained invalid text, or you are attempting to initialize on a domain that is not specified in your Key.
      */
    KeyExpiredOrInvalid = 8,
    /**
    * The Session was cancelled, the FaceTec Browser SDK was opened in an IFrame without permission.
    */
    IFrameNotAllowedWithoutPermission = 9,
    /**
    * FaceTec SDK is still loading resources.
    */
    StillLoadingResources = 10,
    /**
    * FaceTec SDK could not load resources.
    */
    ResourcesCouldNotBeLoadedOnLastInit = 11
}
/** Represents the various end states of a FaceTec Browser Session */
export declare enum FaceTecSessionStatus {
    /**
     * The Session was performed successfully and a FaceScan was generated.  Pass the FaceScan to the Server for further processing.
     */
    SessionCompletedSuccessfully = 0,
    /**
     * The Session was cancelled because not all guidance images were configured.
     */
    MissingGuidanceImages = 1,
    /**
     * The Session was cancelled because the user was unable to complete a Session in the default allotted time or the timeout set by the developer.
     */
    Timeout = 2,
    /**
     * The Session was cancelled due to the app being terminated, put to sleep, an OS notification, or the app was placed in the background.
     */
    ContextSwitch = 3,
    /**
     * The developer programmatically called the Session cancel API.
     */
    ProgrammaticallyCancelled = 4,
    /**
     * The Session was cancelled due to a device orientation change during the Session.
     */
    OrientationChangeDuringSession = 5,
    /**
     * The Session was cancelled because device is in landscape mode.
     * The user experience of devices in these orientations is poor and thus portrait is required.
     */
    LandscapeModeNotAllowed = 6,
    /**
     * The user pressed the cancel button and did not complete the Session.
     */
    UserCancelled = 7,
    /**
     * The user pressed the cancel button during New User Guidance.
     */
    UserCancelledFromNewUserGuidance = 8,
    /**
     * The user pressed the cancel button during Retry Guidance.
     */
    UserCancelledFromRetryGuidance = 9,
    /**
     * The user cancelled out of the the FaceTec Browser SDK experience while attempting to get camera permissions.
     */
    UserCancelledWhenAttemptingToGetCameraPermissions = 10,
    /**
     * The Session was cancelled because the user was in a locked out state.
     */
    LockedOut = 11,
    /**
     * The Session was cancelled because camera was not enabled.
     */
    CameraNotEnabled = 12,
    /**
     * This status will never be returned in a properly configured or production app.
     * This status is returned if your Key is invalid or network connectivity issues occur during a session when the application is not in production.
     */
    NonProductionModeDeviceKeyIdentifierInvalid = 13,
    /**
     * The Session was cancelled because the FaceTec Browser SDK cannot be rendered when the document is not ready.
     */
    DocumentNotReady = 14,
    /**
     * The Session was cancelled because there was another Session in progress.
     */
    SessionInProgress = 15,
    /**
     * The Session was cancelled because the selected camera is not active.
     */
    CameraNotRunning = 16,
    /**
     * The Session was cancelled because initialization has not been completed yet.
     */
    InitializationNotCompleted = 17,
    /**
     * The Session was cancelled because of an unknown and unexpected error.  The FaceTec Browser SDK leverages a variety of platform APIs including camera, storage, security, networking, and more.
     * This return value is a catch-all for errors experienced during normal usage of these APIs.
     */
    UnknownInternalError = 18,
    /**
     * The Session cancelled because user pressed the Get Ready screen subtext message.
     * Note: This functionality is not available by default, and must be requested from FaceTec in order to enable.
     */
    UserCancelledViaClickableReadyScreenSubtext = 19,
    /**
    * The Session was cancelled, the FaceTec Browser SDK was opened in an Iframe without an Iframe constructor.
    */
    NotAllowedUseIframeConstructor = 20,
    /**
    * The Session was cancelled, the FaceTec Browser SDK was not opened in an Iframe with an Iframe constructor.
    */
    NotAllowedUseNonIframeConstructor = 21,
    /**
    * The Session was cancelled, the FaceTec Browser SDK was not opened in an Iframe without permission.
    */
    IFrameNotAllowedWithoutPermission = 22,
    /**
    * FaceTec SDK is still loading resources.
    */
    StillLoadingResources = 23,
    /**
    * FaceTec SDK could not load resources.
    */
    ResourcesCouldNotBeLoadedOnLastInit = 24,
    /**
    * The Session was cancelled because a full screen mode change was detected in an IFrame
    */
    UserCancelledFullScreenMode = 25
}
/** Result returned in callback function passed to FaceTecSession */
export interface FaceTecSessionResult {
    faceScan: string | null;
    auditTrail: string[];
    lowQualityAuditTrail: string[];
    sessionId: string | null;
    status: FaceTecSessionStatus;
    isCompletelyDone: boolean;
    [key: string]: string | FaceTecSessionStatus | null | {};
}
/** Callback functions for the FaceTecFaceScanProcessor */
export declare class FaceTecFaceScanResultCallback {
    proceedToNextStep: (scanResultBlob: string, idScanNextStep?: FaceTecIDScanNextStep) => void;
    succeed: (idScanNextStep?: FaceTecIDScanNextStep) => void;
    retry: (retryScreen?: FaceTecRetryScreen) => void;
    cancel: () => void;
    uploadProgress: (uploadedPercent: number) => void;
    uploadMessageOverride: (uploadMessageOverride: string) => void;
}
/** Abstract class for developer to override for processing FaceTec sessions. */
export declare abstract class FaceTecFaceScanProcessor {
    abstract onFaceTecSDKCompletelyDone: () => void;
    abstract processSessionResultWhileFaceTecSDKWaits: (sessionResult: FaceTecSessionResult, faceScanResultCallback: FaceTecFaceScanResultCallback) => void;
}
/** FaceTec ID Scan result status enum */
export declare enum FaceTecIDScanStatus {
    /**
    The ID Scan was successful.
   */
    Success = 0,
    /**
     The ID Scan was not successful
    */
    Unsuccess = 1,
    /**
     User cancelled ID Scan
    */
    UserCancelled = 2,
    /**
     Timeout during ID Scan
    */
    TimedOut = 3,
    /**
     Context Switch during ID Scan
    */
    ContextSwitch = 4,
    /**
     Error setting up the ID Scan Camera
    */
    CameraError = 5,
    /**
     Camera Permissions were not enabled
    */
    CameraNotEnabled = 6,
    /**
     ID Scan was skipped.
    */
    Skipped = 7
}
/** ID Scan Result object */
export interface FaceTecIDScanResult {
    status: FaceTecIDScanStatus;
    idScan: string | null;
    frontImages: string[];
    backImages: string[];
    sessionId: string | null;
    isCompletelyDone: boolean;
}
/** Callback functions for FaceTecIDScanProcessor */
export declare class FaceTecIDScanResultCallback {
    cancel: () => void;
    uploadProgress: (uploadedPercent: number) => void;
    uploadMessageOverride: (uploadMessageOverride: string) => void;
    proceedToNextStep: (scanResultBlob: string, idScanNextStep?: FaceTecIDScanNextStep) => void;
}
/** Abstract class for developer to override for processing FaceTec ID Scans. */
export declare abstract class FaceTecIDScanProcessor {
    abstract onFaceTecSDKCompletelyDone: () => void;
    abstract processSessionResultWhileFaceTecSDKWaits: (sessionResult: FaceTecSessionResult, faceScanResultCallback: FaceTecFaceScanResultCallback) => void;
    abstract processIDScanResultWhileFaceTecSDKWaits: (idScanResult: FaceTecIDScanResult, idCheckResultCallback: FaceTecIDScanResultCallback) => void;
}
/**
 * Describes the next step to go into during the Photo ID Match process.
 * By default, when FaceTecFaceScanProcessor.succeed() is called, the User is taken to the ID Document Type Selection Screen.
 * Passing different values of FaceTecIDScanNextStep as a parameter for FaceTecFaceScanResultCallback.succeed() allows you to control whether to take the User to the ID Document Type Selection Screen or to  skip the ID Scan process altogether.
 * You may want to skip the ID Scan process altogether if you have custom server-side logic that in some cases deems the Photo ID Match flow as not necessary.
 */
export declare enum FaceTecIDScanNextStep {
    /**
     * Start ID Scan process with showing the Selection Screen.
     * This is default behavior.
     */
    SelectionScreen = 0,
    /**
     * Skip the entire ID Scan process, exiting from the FaceTec Browser SDK interface after a successful Session.
     */
    Skip = 1
}
/**
 * Vocal Guidance Modes
 * By default VocalGuidanceCustomization mode is set to MINIMAL_VOCAL_GUIDANCE
 */
export declare enum FaceTecVocalGuidanceMode {
    MINIMAL_VOCAL_GUIDANCE = 0,
    FULL_VOCAL_GUIDANCE = 1,
    NO_VOCAL_GUIDANCE = 2
}
/**
 * Interface for the SDK Initialize Callback
 */
export interface InitializeCallback {
    (result: boolean): void;
}
/**
 * Max Audit Trail Images To Return
 * By default one audit trail image will be returned
 */
export declare enum FaceTecAuditTrailImagesToReturn {
    ONE = "1",
    UP_TO_SIX = "6"
}
