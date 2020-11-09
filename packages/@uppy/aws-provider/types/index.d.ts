import Uppy = require('@uppy/core')
import CompanionClient = require('@uppy/companion-client')

declare module AWSProvider {
  interface AWSProviderOptions
    extends Uppy.PluginOptions,
      CompanionClient.PublicProviderOptions {
    replaceTargetContent?: boolean
    target?: Uppy.PluginTarget
    title?: string
    storage?: CompanionClient.TokenStorage
  }
}

declare class AWSProvider extends Uppy.Plugin<AWSProvider.AWSProviderOptions> {}

export = AWSProvider
