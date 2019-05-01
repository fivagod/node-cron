const validatePattern = require('./pattern-validation');
const convertExpression = require('./convert-expression');
const moment = require('moment')

function matchPattern(pattern, value){
    if( pattern.indexOf(',') !== -1 ){
        var patterns = pattern.split(',');
        return patterns.indexOf(value.toString()) !== -1;
    }
    return pattern === value.toString();
}

class TimeMatcher{
    constructor(pattern, timezone){
        validatePattern(pattern);
        this.pattern = convertExpression(pattern);
        this.timezone = timezone;
        this.expressions = this.pattern.split(' ');
    }

    match(date){
        let [seconds, minutes, hours, day, month, weekday] = [date.getSeconds(), date.getMinutes(), date.getHours(), date.getDate(), date.getMonth() + 1, date.getDay()]
        if(this.timezone){
            let dt = moment(date).tz(this.timezone);
            [seconds, minutes, hours, day, month, weekday] = [dt.seconds(), dt.minutes(), dt.hours(), dt.date(), dt.month() + 1, dt.day()]
        }
        var runOnSecond = matchPattern(this.expressions[0], seconds);
        var runOnMinute = matchPattern(this.expressions[1], minutes);
        var runOnHour = matchPattern(this.expressions[2], hours);
        var runOnDay = matchPattern(this.expressions[3], day);
        var runOnMonth = matchPattern(this.expressions[4], month);
        var runOnWeekDay = matchPattern(this.expressions[5], weekday);

        return runOnSecond && runOnMinute && runOnHour && runOnDay && runOnMonth && runOnWeekDay;
    }
}

module.exports = TimeMatcher;