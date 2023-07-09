const $ = require('jquery');
var DS = require('nedb');

var el = {
    accountSettings: {}
};

var data = {
    accountSettings: {
        capital: 0,
        minRisk: 0,
        maxRisk: 0,
        makerFee: 0,
        takerFee: 0
    }
};

var db = {};

function cacheSelectors() {
    cacheAccountSettingsSelectors();
}

function cacheAccountSettingsSelectors() {
    el.accountSettings.editButton = $('#button-edit-account-settings');
    el.accountSettings.form = $('#form-account-settings');
    el.accountSettings.section = $('#section-account-settings');
    el.accountSettings.cancel = $('#button-cancel-account-settings');
    el.accountSettings.save = $('#button-save-account-settings');
}

function eventBindings() {
    eventBindingsForAccountSettings();
}

function eventBindingsForAccountSettings() {
    el.accountSettings.editButton.click(() => { toggleAccountSettingsForm(true) });
    el.accountSettings.cancel.click(() => { toggleAccountSettingsForm(false) });
    el.accountSettings.save.click(() => {
        updateAccountSettingsData();
        toggleAccountSettingsForm(false);
        renderAccountSettingsData();
    });
}

function toggleAccountSettingsForm(showForm) {
    if (showForm) {
        renderAccountSettingsData(true);
        el.accountSettings.form.removeClass('hide');
        el.accountSettings.section.addClass('hide');
    } else {
        el.accountSettings.form.addClass('hide');
        el.accountSettings.section.removeClass('hide');
    }
}

function updateAccountSettingsData() {
    data.accountSettings.capital = $('#txt-capital').val();
    data.accountSettings.minRisk = $('#txt-min-risk').val();
    data.accountSettings.maxRisk = $('#txt-max-risk').val();
    data.accountSettings.makerFee = $('#txt-maker-fee').val();
    data.accountSettings.takerFee = $('#txt-taker-fee').val();

    db.accountSettings.findOne({ exchange: 'default' }, (err, docs) => {
        if (!docs) {
            db.accountSettings.insert({
                exchange: 'default',
                capital: data.accountSettings.capital,
                minRisk: data.accountSettings.minRisk,
                maxRisk: data.accountSettings.maxRisk,
                makerFee: data.accountSettings.makerFee,
                takerFee: data.accountSettings.takerFee
            })
        } else {
            db.accountSettings.update({
                exchange: 'default'
            }, {
                exchange: 'default',
                capital: data.accountSettings.capital,
                minRisk: data.accountSettings.minRisk,
                maxRisk: data.accountSettings.maxRisk,
                makerFee: data.accountSettings.makerFee,
                takerFee: data.accountSettings.takerFee
            })
        }
    })
}

function renderAccountSettingsData(isForm) {
    if (isForm) {
        $('#txt-capital').val(data.accountSettings.capital);
        $('#txt-min-risk').val(data.accountSettings.minRisk);
        $('#txt-max-risk').val(data.accountSettings.maxRisk);
        $('#txt-maker-fee').val(data.accountSettings.makerFee);
        $('#txt-taker-fee').val(data.accountSettings.takerFee);
    } else {
        $('#lbl-capital').html(data.accountSettings.capital);
        $('#lbl-min-risk').html(data.accountSettings.minRisk);
        $('#lbl-max-risk').html(data.accountSettings.maxRisk);
        $('#lbl-maker-fee').html(data.accountSettings.makerFee);
        $('#lbl-taker-fee').html(data.accountSettings.takerFee);
    }
}

$(window).on('load', () => {

    db.accountSettings = new DS({
        filename: './account-settings.db',
        autoload: true,
        timestampData: true
    });

    db.accountSettings.findOne({ exchange: 'default' }, (err, docs) => {
        if (docs) {
            console.log(docs);
            data.accountSettings.capital = docs.capital;
            data.accountSettings.minRisk = docs.minRisk;
            data.accountSettings.maxRisk = docs.maxRisk;
            data.accountSettings.makerFee = docs.makerFee;
            data.accountSettings.takerFee = docs.takerFee;
        }

        renderAccountSettingsData();
    })

    cacheSelectors();
    eventBindings();

})