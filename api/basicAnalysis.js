function reduceDateTime(symbol_input,date, time,forgetTime_minute, forgetTime) {
    function sumDigits(number) {

        return String(number)
            .split('')
            .reduce((sum, digit) => sum + parseInt(digit), 0);

    }

    function reduceAndLog(initialNumber, additionalNumber) {
        let number = initialNumber + (additionalNumber ? sumDigits(additionalNumber) : 0);
        //console.log(sumDigits(additionalNumber));
        let results = [number];

        while (number >= 10) {
            number = sumDigits(number);
            results.push(number);
        }

        return results.join('/');
    }

    // 解析日期和时间
    const [year, month, day] = date.split('-').map(Number);
    if(forgetTime){
        time = '00:00'; 
    }
    else if (forgetTime_minute){
        time = `${time.split(':').map(Number)[0]}:00`;
    }
    const [hour, minute] = time.split(':').map(Number);

    // 计算年、月、日的累加和
    let yearSum = sumDigits(year);
    let monthSum = yearSum + sumDigits(month);
    let daySum = monthSum + sumDigits(day);

    // 计算时分的合计（根据 forgetTime 参数来决定是否计算）
    let hourSum = forgetTime ? 0 : daySum + sumDigits(hour);
    let minuteSum = forgetTime_minute ? 0 : hourSum + sumDigits(minute);

    // 依次处理年、月、日、时、分
    let yearResult = reduceAndLog(yearSum, null);   // 21/3
    let monthResult = reduceAndLog(yearSum, month); // 23/5    
    let dayResult = reduceAndLog(monthSum, day);    // 30/3
    let hourResult = forgetTime ? 0 : reduceAndLog(daySum, hour);    // 34/7
    let minuteResult = forgetTime_minute ? 0 : reduceAndLog(hourSum, minute); // 39/12/3
    let dayResult_Symbol_Number = dayResult.split("/")[1];  //3
    // let targetChar = "/";
    // // 插入固定内容
    // yearResult = yearResult.replace(targetChar, `<span>${targetChar}</span>`);
    // monthResult = monthResult.replace(targetChar, `<span>${targetChar}</span>`);
    // dayResult = dayResult.replace(targetChar, `<span>${targetChar}</span>`);
    // hourResult = hourResult.replace(targetChar, `<span>${targetChar}</span>`);
    // minuteResult = minuteResult.replace(targetChar, `<span>${targetChar}</span>`);
    date = date.replace(/-/g, ' . ');
    time = time.replace(/:/g, ' . ');
    // 返回格式化结果
    if(forgetTime){
        return `${symbol_input} ${date} . ${time}\n *${yearResult}* 、 *${monthResult}* 、 *${dayResult}* &&${dayResult_Symbol_Number}`;
    }else if (forgetTime_minute){
        return `${symbol_input} ${date} . ${time}\n *${yearResult}* 、 *${monthResult}* 、 *${dayResult}* 、 *${hourResult}* &&${dayResult_Symbol_Number}`;
    }else{
        return `${symbol_input} ${date} . ${time}\n *${yearResult}* 、 *${monthResult}* 、 *${dayResult}* 、 *${hourResult}* 、 *${minuteResult}* &&${dayResult_Symbol_Number}`;
    }
    
}

 module.exports = reduceDateTime;