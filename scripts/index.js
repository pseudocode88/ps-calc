var db = {};

$(window).on('load', () => {
    db.accountSettings = new DS({
        filename: './account-settings.db',
        autoload: true,
        timestampData: true
    });

    this.observer = Observer;

    this.modules = {
        AccountSettings: AccountSettings($, db.accountSettings),
        PositionSizeBuilder: PositionSizeBuilder($),
        PositionSizeSuggestion: PositionSizeSuggestion($)
    }

    this.modules.AccountSettings.init();
    this.modules.PositionSizeBuilder.init();

    this.observer.on('PositionSizeCalculated', this.modules.PositionSizeSuggestion.render);
    this.observer.on('AccountSettingsLoaded', this.modules.PositionSizeBuilder.sync);
})