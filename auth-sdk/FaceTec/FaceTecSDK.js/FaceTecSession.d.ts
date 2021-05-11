import { FaceTecIDScanProcessor, FaceTecFaceScanProcessor } from "./FaceTecPublicApi";
/**
 * FaceTecSession - Core class responsible for launching the FaceTec SDK and handling results.
 */
export declare class FaceTecSession {
    /**
     * Constructor that takes a FaceTecFaceScanProcessor.
     * Use this for 3D Liveness Checks, 3D Enrollment, or 3D:3D Matching (Authentication).
     */
    constructor(faceScanProcessor: FaceTecFaceScanProcessor, sessionToken: string);
    /**
     * Constructor that takes a FaceTecIDScanProcessor.
     * Use this for Photo ID Match process, which includes a 3D Liveness Check, and a 3D:2D Match to a Photo ID.
     */
    constructor(idScanProcessor: FaceTecIDScanProcessor, sessionToken: string);
}
export declare class FaceTecSessionFromIFrame {
    /**
     * Constructor that takes a FaceTecFaceScanProcessor.
     * Use this for 3D Liveness Checks, 3D Enrollment, or 3D:3D Matching (Authentication).
     */
    constructor(faceScanProcessor: FaceTecFaceScanProcessor, sessionToken: string);
    /**
     * Constructor that takes a FaceTecIDScanProcessor.
     * Use this for Photo ID Match process, which includes a 3D Liveness Check, and a 3D:2D Match to a Photo ID.
     */
    constructor(idScanProcessor: FaceTecIDScanProcessor, sessionToken: string);
}
