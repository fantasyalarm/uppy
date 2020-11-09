import Uppy = require('@uppy/core')
import AWSProvider = require('../')

class SomePlugin extends Uppy.Plugin<{}> {}

const uppy = Uppy<Uppy.StrictTypes>()
uppy.use(AWSProvider, { companionUrl: '' })
uppy.use(AWSProvider, { target: SomePlugin, companionUrl: '' })
uppy.use(AWSProvider, { target: document.querySelector('#gdrive')!, companionUrl: '' })
