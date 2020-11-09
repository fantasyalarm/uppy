const ProviderViews = require('@uppy/provider-views')

module.exports = class AWSProviderViews extends ProviderViews {
  toggleCheckbox (e, file) {
    e.stopPropagation()
    e.preventDefault();
    console.log(e);
    console.log(file);
    // Shared Drives aren't selectable; for all else, defer to the base ProviderView.
    // @todo isTeamDrive is left for backward compatibility. We should remove it in the next
    // major release.
    if (!file.custom.isTeamDrive && !file.custom.isSharedDrive) {
      super.toggleCheckbox(e, file)
    }
  }
}
