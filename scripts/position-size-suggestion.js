var PositionSizeSuggestion = ($) => {
    var renderSuggestion = () => {
        var accountSettingsData = this.modules.AccountSettings.getData(),
            positionSizeData = this.modules.PositionSizeBuilder.getData(),
            riskLevels = {},
            suggestions = [];

        riskLevels = getRiskLevels(accountSettingsData);
        suggestions = calculateSuggestions(riskLevels, positionSizeData);
        render(suggestions, positionSizeData); 10
    }

    var calculateSuggestions = (riskLevels, positionSizeData) => {
        var risk = 0,
            margin = 0,
            leverage = 1,
            positionSize = 0,
            gain = 0,
            stopLoss = positionSizeData.stopLoss / 100,
            takeProfit = positionSizeData.takeProfit / 100,
            id = '',
            suggestions = [];

        return Object.keys(riskLevels).map((key) => {
            id = key;
            risk = riskLevels[key];
            margin = risk + 1;
            leverage = Math.floor(risk / (margin * stopLoss));
            positionSize = Math.floor(margin * leverage);
            gain = Math.floor(positionSize * takeProfit);

            return {
                id: id,
                risk: risk,
                margin: margin,
                leverage: leverage,
                gain: gain,
                positionSize: positionSize
            };
        });
    }

    var render = (suggestions, positionSizeData) => {
        var prefix = '';

        suggestions.forEach((item) => {
            prefix = '#' + item.id + '-'
            $(prefix + "size").html(item.positionSize);
            $(prefix + "loss").html(item.risk);
            $(prefix + "gain").html(item.gain);
            $(prefix + "lev").html(item.leverage);
            $(prefix + "margin").html(item.margin);
        })

        $('#best-position').html(suggestions[0].positionSize + '-' + suggestions[3].positionSize);
        $('#best-stop-loss').html(positionSizeData.stopLoss + '%');
    }

    var getRiskLevels = (data) => {
        return {
            l: Math.floor(data.capital * ((data.minRisk - 1) / 100)),
            m: Math.floor(data.capital * (data.minRisk / 100)),
            h: Math.floor(data.capital * (((parseFloat(data.minRisk) + parseFloat(data.maxRisk)) / 2) / 100)),
            xh: Math.floor(data.capital * (data.maxRisk / 100))
        }
    }

    return {
        render: renderSuggestion
    }
}