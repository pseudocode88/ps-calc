var PositionSizeBuilder = ($) => {

    var data = {
        stopLoss: 0,
        entryPrice: 0,
        leverage: 1,
        risk: 0,
        direction: 'long',
        positionSizeUnit: 0,
        positionSizeUSD: 0,
        margin: 0
    };

    var el = {
        textfield: {
            stopLoss: $('#stop-loss'),
            entryPrice: $('#entry-price'),
            leverage: $('#leverage'),
            riskAmount: $('#risk-amount')
        },
        label: {
            positionSizeUnit: $('#label-position-size-units'),
            positionSizeUSD: $('#label-position-size-usd'),
            margin: $('#label-margin-usd')
        },
        wrapper: {
            result: $('#result-panel')
        }
    }

    var eventBindings = () => {
        Object.keys(el.textfield).forEach(function (id) {
            el.textfield[id].on("keyup", updatePositionSize)
        })
    }

    var getFormData = () => {
        const formFields = {
            stopLoss: el.textfield.stopLoss,
            entryPrice: el.textfield.entryPrice,
            leverage: el.textfield.leverage,
            risk: el.textfield.riskAmount
        };

        return Object.entries(formFields).reduce((acc, [key, element]) => {
            acc[key] = element.val() || '1';
            return acc;
        }, {});
    }

    var updatePositionSize = () => {
        const formData = getFormData();
        const data = calculatePositionSize(formData);
        console.log(data);
        updateData(data);
        render();
    }

    var updateData = (formData) => {
        Object.keys(formData).forEach((key) => {
            data[key] = formData[key];
        })
    }

    var calculatePositionSize = (data) => {
        const { risk, entryPrice, stopLoss, leverage } = data;

        const priceDifference = (stopLoss > entryPrice) ? stopLoss - entryPrice : entryPrice - stopLoss;

        data.positionSizeUnit = Math.round(risk / Math.abs(priceDifference));
        data.positionSizeUSD = (data.positionSizeUnit * entryPrice).toFixed(2);
        data.margin = ((data.positionSizeUnit * entryPrice) / leverage).toFixed(2);
        data.direction = (stopLoss > entryPrice) ? 'short' : 'long'

        return data;
    }

    var render = () => {
        const elementsToUpdate = {
            positionSizeUnit: data.positionSizeUnit,
            positionSizeUSD: "$" + data.positionSizeUSD,
            margin: "$" + data.margin
        };

        Object.entries(elementsToUpdate).forEach(([elementKey, value]) => {
            el.label[elementKey].html(value);
        });
    }

    var init = () => {
        eventBindings();
    }

    return {
        init: init
    }
}