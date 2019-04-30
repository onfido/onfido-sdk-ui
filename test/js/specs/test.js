const path = require('path')
const expect = require('chai').expect
import {describe, it} from '../utils/mochaw'

const options = {
  pageObjects: ['DocumentSelection', 'Welcome', 'DocumentUpload', 'DocumentUploadConfirmation']
}

const localhostUrl = 'https://localhost:8080/'

describe('Happy Paths', options, ({driver, pageObjects}) => {
  const {documentSelection, welcome, documentUpload, documentUploadConfirmation} = pageObjects

  
})
