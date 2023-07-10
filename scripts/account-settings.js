var AccountSettings = ($, db) => {

    var data = {
        exchange: 'default',
        capital: 0,
        minRisk: 0,
        minRiskAmt: 0,
        maxRisk: 0,
        maxRiskAmt: 0,
        makerFee: 0,
        takerFee: 0
    };

    var el = {
        txtCapital: $('#txt-capital'),
        txtMinRisk: $('#txt-min-risk'),
        txtMaxRisk: $('#txt-max-risk'),
        txtMakerFee: $('#txt-maker-fee'),
        txtTakerFee: $('#txt-taker-fee'),
        lblCapital: $('#lbl-capital'),
        lblMinRisk: $('#lbl-min-risk'),
        lblMaxRisk: $('#lbl-max-risk'),
        lblMakerFee: $('#lbl-maker-fee'),
        lblTakerFee: $('#lbl-taker-fee'),
        btnEdit: $('#button-edit-account-settings'),
        btnCancel: $('#button-cancel-account-settings'),
        btnSave: $('#button-save-account-settings'),
        divForm: $('#form-account-settings'),
        divSection: $('#section-account-settings')
    }

    var eventBindings = () => {
        el.btnEdit.on("click", () => { toggleSection(true) });
        el.btnCancel.on("click", () => { toggleSection(false) });
        el.btnSave.on("click", () => {
            updateLocalData(getFormData());
            updateDB();
            toggleSection(false);
        });
    }

    function toggleSection(showForm) {
        render(showForm);

        if (showForm) {
            el.divForm.removeClass('hide');
            el.divSection.addClass('hide');
        } else {
            el.divForm.addClass('hide');
            el.divSection.removeClass('hide');
        }
    }

    var getFormData = () => {
        var formData = {
            exchange: 'default',
            capital: parseFloat(el.txtCapital.val()),
            minRisk: parseFloat(el.txtMinRisk.val()),
            maxRisk: parseFloat(el.txtMaxRisk.val()),
            makerFee: parseFloat(el.txtMakerFee.val()),
            takerFee: parseFloat(el.txtTakerFee.val()),
            minRiskAmt: 0,
            maxRiskAmt: 0
        };

        formData.minRiskAmt = parseFloat(formData.capital * (formData.minRisk / 100));
        formData.maxRiskAmt = parseFloat(formData.capital * (formData.maxRisk / 100));

        return formData;
    }

    var updateDB = () => {
        db.findOne({ exchange: 'default' }, (err, docs) => {
            if (!docs) {
                db.insert(data)
            } else {
                db.update({ exchange: 'default' }, data);
            }
        })
    }

    var updateLocalData = (docs) => {
        data.exchange = docs.exchange;
        data.capital = parseFloat(docs.capital);
        data.minRisk = parseFloat(docs.minRisk);
        data.minRiskAmt = parseFloat(docs.minRiskAmt);
        data.maxRisk = parseFloat(docs.maxRisk);
        data.maxRiskAmt = parseFloat(docs.maxRiskAmt);
        data.makerFee = parseFloat(docs.makerFee);
        data.takerFee = parseFloat(docs.takerFee);
    }

    var render = (isForm) => {
        if (isForm) {
            el.txtCapital.val(data.capital);
            el.txtMinRisk.val(data.minRisk);
            el.txtMaxRisk.val(data.maxRisk);
            el.txtMakerFee.val(data.makerFee);
            el.txtTakerFee.val(data.takerFee);
        } else {
            el.lblCapital.html(data.capital);
            el.lblMinRisk.html(data.minRisk + '%');
            el.lblMaxRisk.html(data.maxRisk + '%');
            el.lblMakerFee.html(data.makerFee + '%');
            el.lblTakerFee.html(data.takerFee + '%');
        }
    }

    var getData = () => {
        return data;
    }

    var init = () => {
        eventBindings();
        var that = this;

        db.findOne({ exchange: 'default' }, (err, docs) => {
            if (docs) {
                updateLocalData(docs);
                that.observer.fire('AccountSettingsLoaded');
            }
            render();
        })
    }

    return {
        init: init,
        getData: getData
    };

};