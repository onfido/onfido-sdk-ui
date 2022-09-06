import { DocumentSides } from '~types/commons'
import { DocumentTypes } from '~types/steps'

type Point = {
  x: number
  y: number
}

type ImageType = 'CHANGE_THIS_LATER_TO_REAL_TYPE'

type ImageResizerConfiguration = {
  resize_pixels: number // how many pixels to resize to before computing other steps
  rectangle_top_left: Point // the top left coordinates of the rectangle we're interested in (overlay)
  rectangle_bottom_right: Point // the bottom right coordinates of the rectangle we're interested in (overlay)
  crop_box_offset: number // how much more to actually crop than the highlighted rectangle
}

type ImageResizerResult = {
  cropped_image: ImageType
  resized_image: ImageType
}

type ValidationContext = {
  resized_gray_image: ImageType
}

type EdgeValidationConfiguration = {
  hough_line_maxLineGap: number
  hough_line_minLineLength: number
  hough_line_treshold: number
  hough_line_theta: number

  canny_threshold1: number
  canny_threshold2: number
  canny_aperture: number

  num_segment: number // How many segmnents to split each of the four edges
  angle_tolerance: number // how not really vertical or horizontal do we allow lines to be
  line_check_region_in: number // inside margin
  line_check_region_out: number // outside margin
  detect_line_threshold: number // What's the min score required to say "ok edge detected" for a particular line

  required_edges: number // how many lines detected to pass the edge validation
}

type EdgeValidationResult = {
  enough_edges_detected: boolean
  total_edges_detected: number
}

type BlurValidationConfiguration = {
  blur_required_Images: number // how many Images we need to have in memory before being allowed to select one for blur check
  blur_threshold: number // the min blur threshold for validation
}

type ContextConfiguration = {
  client: string // ims id
  docType: DocumentTypes
  side: DocumentSides
  country: string
}

type RootConfiguration = {
  BlurValidationConfiguration: BlurValidationConfiguration
  ContextConfiguration: ContextConfiguration
  EdgeValidationConfiguration: EdgeValidationConfiguration
  ImageResizerConfiguration: ImageResizerConfiguration
  Validators: Array<ValidatorType>
}

type BlurValidationResult = {
  laplacian_variance: number
  has_blur: boolean
}

type ValidationResult = {
  validationSuccess: boolean // has the current validation been successful.
  EdgeValidationResult?: EdgeValidationResult
  BlurValidationResult?: BlurValidationResult
  DetectedDocument?: Blob // when all validation pass, this will be filled with a cropped image of the detected document.
}

type ValidatorType = 'edge_opencv' | 'blur_opencv'

export {
  BlurValidationConfiguration,
  BlurValidationResult,
  ContextConfiguration,
  EdgeValidationConfiguration,
  EdgeValidationResult,
  ImageResizerConfiguration,
  ImageResizerResult,
  ImageType,
  ValidationContext,
  RootConfiguration,
  ValidatorType,
  ValidationResult,
}
