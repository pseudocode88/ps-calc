var PositionSizeBuilder = ($) => {

    var data = {
        stopLoss: 0,
        entryPoint: 0,
        leverage: 1,
        positionSize: 0,
        margin: 0,
        risk: 0,
    };

    var el = {
        txtStopLoss: $('#txt-sl'),
        txtEntryPoint: $('#txt-ep'),
        txtLeverage: $('#txt-lev'),
        txtRiskAmount: $('#txt-risk'),
        lblPositionSize: $('#lbl-ps'),
        lblMargin: $('#lbl-margin')
    }

    var eventBindings = () => {
        el.txtStopLoss.on("keyup", updatePositionSize);
        el.txtEntryPoint.on("keyup", updatePositionSize);
        el.txtLeverage.on("keyup", updatePositionSize);
        el.txtRiskAmount.on("keyup", updatePositionSize);
    }

    var getFormData = () => {
        return {
            stopLoss: el.txtStopLoss.val() || 1,
            entryPoint: el.txtEntryPoint.val() || 1,
            leverage: el.txtLeverage.val() || 1,
            risk: el.txtRiskAmount.val() || 1
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

    // unit = risk /(ep - sl)
    // margin = (unit * ep)/lev

    var calculatePositionSize = () => {
        data.positionSize = Math.round(data.risk / (data.entryPoint - data.stopLoss));

        data.margin = (data.positionSize * data.entryPoint) / data.leverage;
        data.margin = data.margin.toFixed(2);

        // data.risk = ((data.stopLoss / 100) * data.leverage) * data.margin
        // data.risk = data.risk.toFixed(2);

        // data.gain = ((data.takeProfit / 100) * data.leverage) * data.margin
        // data.gain = data.gain.toFixed(2);

        return data;
    }

    var render = () => {
        // el.lblRisk.html(data.risk);
        // el.lblGain.html(data.gain);
        el.lblMargin.html(data.margin);
        el.lblPositionSize.html(data.positionSize);

        var accountSettingsData = this.modules.AccountSettings.getData();

        // if (data.risk < accountSettingsData.minRiskAmt) {
        //     el.lblRisk.removeClass('clr-warning clr-danger').addClass('clr-success');
        // } else if (data.risk > accountSettingsData.minRiskAmt && data.risk < accountSettingsData.maxRiskAmt) {
        //     el.lblRisk.removeClass('clr-danger clr-success').addClass('clr-warning');
        // } else {
        //     el.lblRisk.removeClass('clr-success clr-warning').addClass('clr-danger');
        // }
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