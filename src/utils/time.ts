import dayjs from "dayjs";

export function rangesTimes(): any {
    return {
        '当日': getSearchTime('day'),
        '昨日': getSearchTime('lastDay'),
        '本周': getSearchTime('week'),
        '本月': getSearchTime('month'),
        '本季': getSearchTime('quarter'),
        '本年': getSearchTime('year'),
        '去年': getSearchTime('lastYear'),
    }
}

//获取时间
function getSearchTime(type: string) {
    switch (type) {
        case 'day':
            return getTodayRange()
        case 'lastDay':
            return getLastDayRange()
        case 'week':
            return getWeekRange()
        case 'month':
            return getMonthRange()
        case 'quarter':
            return getQuarterRange()
        case 'year':
            return getYearRange()
        case 'lastYear':
            return getLastYearRange()
        default :
            return getTodayRange()
    }
}

function getTodayRange() {
    return [dayjs().startOf('day'), dayjs().endOf('day')]
}

function getLastDayRange() {
    return [
        dayjs().subtract(1, 'day').startOf('day'),
        dayjs().subtract(1, 'day').endOf('day')
    ]
}

function getWeekRange() {
    return [dayjs().startOf('week'), dayjs().endOf('week')]
}


function getMonthRange() {
    return [dayjs().startOf('month'), dayjs().endOf('month')]
}


function getQuarterRange() {
    return [dayjs().startOf(<any>'quarter'), dayjs().endOf(<any>'quarter')]
}

function getYearRange() {
    return [dayjs().startOf('year'), dayjs().endOf('year')]
}

function getLastYearRange() {
    return [
        dayjs().subtract(1, 'year').startOf('year'),
        dayjs().subtract(1, 'year').endOf('year')
    ]
}