var PositionSizeBuilder = ($) => {

    var data = {
        stopLoss: 0,
        takeProfit: 0,
        leverage: 1,
        positionSize: 0,
        margin: 0,
        risk: 0,
        gain: 0
    };

    var el = {
        txtStopLoss: $('#txt-sl'),
        txtTakeProfit: $('#txt-tp'),
        txtLeverage: $('#txt-lev'),
        txtPositionSize: $('#txt-ps'),
        lblRisk: $('#lbl-risk'),
        lblGain: $('#lbl-gain'),
        lblMargin: $('#lbl-margin')
    }

    var eventBindings = () => {
        el.txtStopLoss.on("keyup", updatePositionSize);
        el.txtTakeProfit.on("keyup", updatePositionSize);
        el.txtLeverage.on("keyup", updatePositionSize);
        el.txtPositionSize.on("keyup", updatePositionSize);
    }

    var getFormData = () => {
        return {
            stopLoss: el.txtStopLoss.val() || 1,
            takeProfit: el.txtTakeProfit.val() || 1,
            leverage: el.txtLeverage.val() || 1,
            positionSize: el.txtPositionSize.val()
        }
    }

    var updatePositionSize = () => {
        updateLocalData(getFormData());
        calculatePositionSize();
        render();
        this.observer.fire('PositionSizeCalculated')
    }

    var updateLocalData = (formData) => {
        Object.keys(formData).forEach((key) => {
            data[key] = formData[key];
        })
    }

    var calculatePositionSize = () => {
        data.margin = data.positionSize / data.leverage;
        data.margin = data.margin.toFixed(2);

        data.risk = ((data.stopLoss / 100) * data.leverage) * data.margin
        data.risk = data.risk.toFixed(2);

        data.gain = ((data.takeProfit / 100) * data.leverage) * data.margin
        data.gain = data.gain.toFixed(2);

        return data;
    }

    var render = () => {
        el.lblRisk.html(data.risk);
        el.lblGain.html(data.gain);
        el.lblMargin.html(data.margin);

        var accountSettingsData = this.modules.AccountSettings.getData();

        if (data.risk < accountSettingsData.minRiskAmt) {
            el.lblRisk.removeClass('clr-warning clr-danger').addClass('clr-success');
        } else if (data.risk > accountSettingsData.minRiskAmt && data.risk < accountSettingsData.maxRiskAmt) {
            el.lblRisk.removeClass('clr-danger clr-success').addClass('clr-warning');
        } else {
            el.lblRisk.removeClass('clr-success clr-warning').addClass('clr-danger');
        }
    }

    var getData = () => {
        return data;
    }

    var init = () => {
        eventBindings();
    }

    return {
        init: init,
        getData: getData,
        sync: updatePositionSize,
    }
}