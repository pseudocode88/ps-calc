const $ = require('jquery');
var DS = require('nedb');

var el = {
    psBuilder: {},
    accountSettings: {}
};

var data = {
    psBuilder: {},
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
    cachePSBuilderSelectors();
    cacheAccountSettingsSelectors();
}

function cachePSBuilderSelectors() {
    el.psBuilder.sl = $('#txt-sl');
    el.psBuilder.tp = $('#txt-tp');
    el.psBuilder.lev = $('#txt-lev');

}

function cacheAccountSettingsSelectors() {
    el.accountSettings.editButton = $('#button-edit-account-settings');
    el.accountSettings.form = $('#form-account-settings');
    el.accountSettings.section = $('#section-account-settings');
    el.accountSettings.cancel = $('#button-cancel-account-settings');
    el.accountSettings.save = $('#button-save-account-settings');
}

function eventBindings() {
    eventBindingsForPSBuilder();
    eventBindingsForAccountSettings();
}

function eventBindingsForPSBuilder() {
    el.psBuilder.sl.on("keyup", calc);
    el.psBuilder.tp.on("keyup", calc);
}

function calc() {
    data.psBuilder.sl = el.psBuilder.sl.val();
    data.psBuilder.tp = el.psBuilder.tp.val();

    var riskLevels = {
        l: Math.floor(data.accountSettings.capital * ((data.accountSettings.minRisk - 1) / 100)),
        m: Math.floor(data.accountSettings.capital * (data.accountSettings.minRisk / 100)),
        h: Math.floor(data.accountSettings.capital * (((parseFloat(data.accountSettings.minRisk) + parseFloat(data.accountSettings.maxRisk)) / 2) / 100)),
        xh: Math.floor(data.accountSettings.capital * (data.accountSettings.maxRisk / 100))
    }

    var suggestions = [];

    var r = 0,
        m = 0,
        ps = 0,
        sl = data.psBuilder.sl || 1,
        tp = data.psBuilder.tp || 1,
        g = 0,
        l = 0,
        id = '';

    Object.keys(riskLevels).forEach((key) => {
        id = key;
        r = riskLevels[key];
        m = r + 1;
        l = Math.floor(r / (m * (sl / 100)));
        ps = Math.floor(m * l);
        g = Math.floor((l * m) * (tp / 100));

        suggestions.push({
            id: id,
            r: r,
            m: m,
            l: l,
            g: g,
            ps: ps
        });
    });

    var prefix = '';
    suggestions.forEach((sug) => {
        prefix = '#' + sug.id + '-'
        $(prefix + "size").html(sug.ps);
        $(prefix + "loss").html(sug.r);
        $(prefix + "gain").html(sug.g);
        $(prefix + "lev").html(sug.l);
        $(prefix + "margin").html(sug.m);
    })
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
                capital: parseFloat(data.accountSettings.capital),
                minRisk: parseFloat(data.accountSettings.minRisk),
                maxRisk: parseFloat(data.accountSettings.maxRisk),
                makerFee: parseFloat(data.accountSettings.makerFee),
                takerFee: parseFloat(data.accountSettings.takerFee)
            })
        } else {
            db.accountSettings.update({
                exchange: 'default'
            }, {
                exchange: 'default',
                capital: parseFloat(data.accountSettings.capital),
                minRisk: parseFloat(data.accountSettings.minRisk),
                maxRisk: parseFloat(data.accountSettings.maxRisk),
                makerFee: parseFloat(data.accountSettings.makerFee),
                takerFee: parseFloat(data.accountSettings.takerFee)
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
            data.accountSettings.capital = parseFloat(docs.capital);
            data.accountSettings.minRisk = parseFloat(docs.minRisk);
            data.accountSettings.maxRisk = parseFloat(docs.maxRisk);
            data.accountSettings.makerFee = parseFloat(docs.makerFee);
            data.accountSettings.takerFee = parseFloat(docs.takerFee);
        }

        renderAccountSettingsData();
    })

    cacheSelectors();
    eventBindings();

})