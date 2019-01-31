function mod(a, b) {
    return a - (b * Math.floor(a / b));
}

//  LEAP_GREGORIAN  --  Is a given year in the Gregorian calendar a leap year ?
function leap_gregorian(year) {
    return ((year % 4) === 0) &&
        (!(((year % 100) === 0) && ((year % 400) !== 0)));
}

//  GREGORIAN_TO_JD  --  Determine Julian day number from Gregorian calendar date
const GREGORIAN_EPOCH = 1721425.5;

function gregorian_to_jd(year, month, day) {
    return (GREGORIAN_EPOCH - 1) +
        (365 * (year - 1)) +
        Math.floor((year - 1) / 4) +
        (-Math.floor((year - 1) / 100)) +
        Math.floor((year - 1) / 400) +
        Math.floor((((367 * month) - 362) / 12) +
            ((month <= 2) ? 0 :
                (leap_gregorian(year) ? -1 : -2)
            ) +
            day);
}

//  JD_TO_GREGORIAN  --  Calculate Gregorian calendar date from Julian day

function jd_to_gregorian(jd) {
    let wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
        yindex, year, yearday, leapadj;

    wjd = Math.floor(jd - 0.5) + 0.5;
    depoch = wjd - GREGORIAN_EPOCH;
    quadricent = Math.floor(depoch / 146097);
    dqc = mod(depoch, 146097);
    cent = Math.floor(dqc / 36524);
    dcent = mod(dqc, 36524);
    quad = Math.floor(dcent / 1461);
    dquad = mod(dcent, 1461);
    yindex = Math.floor(dquad / 365);
    year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
    if (!((cent == 4) || (yindex == 4))) {
        year++;
    }
    yearday = wjd - gregorian_to_jd(year, 1, 1);
    leapadj = ((wjd < gregorian_to_jd(year, 3, 1)) ? 0 :
        (leap_gregorian(year) ? 1 : 2)
    );
    const month = Math.floor((((yearday + leapadj) * 12) + 373) / 367),
        day = (wjd - gregorian_to_jd(year, month, 1)) + 1;

    return [year, month, day];
}

const PERSIAN_EPOCH = 1948320.5;

//  PERSIAN_TO_JD  --  Determine Julian day from Persian date

function persian_to_jd(year, month, day) {
    let epbase, epyear;

    epbase = year - ((year >= 0) ? 474 : 473);
    epyear = 474 + mod(epbase, 2820);

    return day +
        ((month <= 7) ?
            ((month - 1) * 31) :
            (((month - 1) * 30) + 6)
        ) +
        Math.floor(((epyear * 682) - 110) / 2816) +
        (epyear - 1) * 365 +
        Math.floor(epbase / 2820) * 1029983 +
        (PERSIAN_EPOCH - 1);
}

//  JD_TO_PERSIAN  --  Calculate Persian date from Julian day

function jd_to_persian(jd) {
    let year, month, day, depoch, cycle, cyear, ycycle,
        aux1, aux2, yday;

    jd = Math.floor(jd) + 0.5;

    depoch = jd - persian_to_jd(475, 1, 1);
    cycle = Math.floor(depoch / 1029983);
    cyear = mod(depoch, 1029983);
    if (cyear == 1029982) {
        ycycle = 2820;
    } else {
        aux1 = Math.floor(cyear / 366);
        aux2 = mod(cyear, 366);
        ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) +
            aux1 + 1;
    }
    year = ycycle + (2820 * cycle) + 474;
    if (year <= 0) {
        year--;
    }
    yday = (jd - persian_to_jd(year, 1, 1)) + 1;
    month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    day = (jd - persian_to_jd(year, month, 1)) + 1;
    return [year, month, day];
}

// Cache original `Date` class. User may set window.Date = JDate

// JDATE class from tahajahangir/jdate
const Date = (window as any).Date;

function digits_fa2en(text) {
    return text.replace(/[۰-۹]/g, function(d) {
        return String.fromCharCode(d.charCodeAt(0) - 1728);
    });
}

function digits_en2fa(text) {
    return text.replace(/\d/g, function(d) {
        return String.fromCharCode(d.charCodeAt(0) + 1728);
    });
}

function pad2(number) {
    return number < 10 ? "0" + number : number;
}

function persian_to_jd_fixed(year, month, day) {
    /*
    Fix `persian_to_jd` so we can use negative or large values for month, e.g:
    persian_to_jd_fixed(1393, 26, 1) == persian_to_jd_fixed(1395, 2, 1)
    persian_to_jd_fixed(1393, -2, 1) == persian_to_jd_fixed(1392, 10, 1)
     */
    if (month > 12 || month <= 0) {
        const yearDiff = Math.floor((month - 1) / 12);
        year += yearDiff;
        month = month - yearDiff * 12;
    }
    return persian_to_jd(year, month, day);
}

function parseDate(string, convertToPersian) {
    /*
     http://en.wikipedia.org/wiki/ISO_8601
     http://dygraphs.com/date-formats.html
     https://github.com/arshaw/xdate/blob/master/src/xdate.js#L414
     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
     tests:
     +parseDate('2014') == +new Date('2014')
     +parseDate('2014-2') == +new Date('2014-02')
     +parseDate('2014-2-3') == +new Date('2014-02-03')
     +parseDate('2014-02-03 12:11') == +new Date('2014/02/03 12:11')
     +parseDate('2014-02-03T12:11') == +new Date('2014/02/03 12:11')
     parseDate('2014/02/03T12:11') == undefined
     +parseDate('2014/02/03 12:11:10.2') == +new Date('2014/02/03 12:11:10') + 200
     +parseDate('2014/02/03 12:11:10.02') == +new Date('2014/02/03 12:11:10') + 20
     parseDate('2014/02/03 12:11:10Z') == undefined
     +parseDate('2014-02-03T12:11:10Z') == +new Date('2014-02-03T12:11:10Z')
     +parseDate('2014-02-03T12:11:10+0000') == +new Date('2014-02-03T12:11:10Z')
     +parseDate('2014-02-03T10:41:10+0130') == +new Date('2014-02-03T12:11:10Z')
     */
    const re = /^(\d|\d\d|\d\d\d\d)(?:([-\/])(\d{1,2})(?:\2(\d|\d\d|\d\d\d\d))?)?(([ T])(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?(Z|([+-])(\d{2})(?::?(\d{2}))?)?)?$/,
        match = re.exec(string);
    // re.exec('2012-4-5 01:23:10.1111+0130')
    //  0                              1       2    3    4    5                      6    7     8     9     10      11       12   13    14
    // ["2012-4-5 01:23:10.1111+0330", "2012", "-", "4", "5", " 01:23:10.1111+0130", " ", "01", "23", "10", "1111", "+0330", "+", "03", "30"]
    if (!match) { return; }
    let separator = match[2],
        timeSeparator = match[6],
        year = +match[1],
        month = +match[3] || 1,
        day = +match[4] || 1,
        isISO = (separator != "/") && (match[6] != " "),
        hour = +match[7] || 0,
        minute = +match[8] || 0,
        seconds = +match[9] || 0,
        millis = +("0." + (match[10] || "0")) * 1000,
        tz = match[11],
        isNonLocal = isISO && (tz || !match[5]),
        tzOffset = (match[12] == "-" ? -1 : 1) * ((+match[13] || 0) * 60 + (+match[14] || 0));
    // timezone should be empty if dates are with / (2012/1/10)
    if ((tz || timeSeparator == "T") && !isISO) { return; }
    // one and only-one of year/day should be 4-chars (2012/1/10 vs 10/1/2012)
    if ((day >= 1000) == (year >= 1000)) { return; }
    if (day >= 1000) {
        // year and day only can be swapped if using '/' as separator
        if (separator == "-") { return; }
        day = +match[1];
        year = day;
    }
    if (convertToPersian) {
        const persian = jd_to_gregorian(persian_to_jd_fixed(year, month, day));
        year = persian[0];
        month = persian[1];
        day = persian[2];
    }
    const date = new Date(year, month - 1, day, hour, minute, seconds, millis);
    if (isNonLocal) {
        date.setUTCMinutes(date.getUTCMinutes() - date.getTimezoneOffset() + tzOffset);
    }
    return date;
}

class JDate {
    public static now: any;
    public static parse: (string: any) => void;
    public static UTC: (year: any, month: any, date: any, hours: any, minutes: any, seconds: any, milliseconds: any) => any;
    public _d: any;
    public _date: any;
    public _cached_date: number[];
    public _cached_utc_date: number[];
    public _cached_utc_date_ts: any;
    public _cached_date_ts: any;
    public getDate: () => any;
    public getMonth: () => number;
    public getUTCDate: () => any;
    public getUTCMonth: () => number;
    public getUTCFullYear: () => any;
    public setFullYear: (yearValue: any) => void;
    public setMonth: (monthValue: any, dayValue: any) => void;
    public setUTCFullYear: (yearValue: any) => void;
    public setUTCDate: (dayValue: any) => void;
    public setUTCMonth: (monthValue: any, dayValue: any) => void;
    public setDate: (dayValue: any) => void;
    public getFullYear: () => any;
    public getTime: () => any;

    constructor(a: any, month?: any, day?: any, hour?: any, minute?: any, second?: any, millisecond?: any) {
        if (typeof a == "string") {
            const convert = (month != undefined) ? month : true;
            this._d = parseDate(digits_fa2en(a), convert);
            if (!this._d) { throw new Error("Cannot parse date string"); }
        } else if (arguments.length == 0) {
            this._d = new Date();
        } else if (arguments.length == 1) {
            this._d = new Date((a instanceof JDate) ? a._d : a);
        } else {
            const persian = jd_to_gregorian(persian_to_jd_fixed(a, (month || 0) + 1, day || 1));
            this._d = new Date(persian[0], persian[1] - 1, persian[2], hour || 0, minute || 0, second || 0, millisecond || 0);
        }
        this._date = this._d;
        this._cached_date_ts = null;
        this._cached_date = [0, 0, 0];
        this._cached_utc_date_ts = null;
        this._cached_utc_date = [0, 0, 0];
    }

    public _persianDate() {
        if (this._cached_date_ts != +this._d) {
            this._cached_date_ts = +this._d;
            this._cached_date = jd_to_persian(gregorian_to_jd(this._d.getFullYear(), this._d.getMonth() + 1, this._d.getDate()));
        }
        return this._cached_date;
    }
    /**
     * Exactly like `_persianDate` but for UTC value of date
     */
    public _persianUTCDate() {
        if (this._cached_utc_date_ts != +this._d) {
            this._cached_utc_date_ts = +this._d;
            this._cached_utc_date = jd_to_persian(gregorian_to_jd(this._d.getUTCFullYear(), this._d.getUTCMonth() + 1, this._d.getUTCDate()));
        }
        return this._cached_utc_date;
    }

    public _setPersianDate(which, value, dayValue) {
        const persian = this._persianDate();
        persian[which] = value;
        if (dayValue !== undefined) {
            persian[2] = dayValue;
        }
        const new_date = jd_to_gregorian(persian_to_jd_fixed(persian[0], persian[1], persian[2]));
        this._d.setFullYear(new_date[0]);
        this._d.setMonth(new_date[1] - 1, new_date[2]);
    }
    /**
     * Exactly like `_setPersianDate`, but operates UTC value
     */
    public _setUTCPersianDate(which, value, dayValue) {
        const persian = this._persianUTCDate();
        if (dayValue !== undefined) {
            persian[2] = dayValue;
        }
        persian[which] = value;
        const new_date = jd_to_gregorian(persian_to_jd_fixed(persian[0], persian[1], persian[2]));
        this._d.setUTCFullYear(new_date[0]);
        this._d.setUTCMonth(new_date[1] - 1, new_date[2]);
    }
}

// All date getter methods
JDate.prototype.getDate = function() {
    return this._persianDate()[2];
};
JDate.prototype.getMonth = function() {
    return this._persianDate()[1] - 1;
};
JDate.prototype.getFullYear = function() {
    return this._persianDate()[0];
};
JDate.prototype.getUTCDate = function() {
    return this._persianUTCDate()[2];
};
JDate.prototype.getUTCMonth = function() {
    return this._persianUTCDate()[1] - 1;
};
JDate.prototype.getUTCFullYear = function() {
    return this._persianUTCDate()[0];
};
// All date setter methods
JDate.prototype.setDate = function(dayValue) {
    this._setPersianDate(2, dayValue);
};
JDate.prototype.setFullYear = function(yearValue) {
    this._setPersianDate(0, yearValue);
};
JDate.prototype.setMonth = function(monthValue, dayValue) {
    this._setPersianDate(1, monthValue + 1, dayValue);
};
JDate.prototype.setUTCDate = function(dayValue) {
    this._setUTCPersianDate(2, dayValue);
};
JDate.prototype.setUTCFullYear = function(yearValue) {
    this._setUTCPersianDate(0, yearValue);
};
JDate.prototype.setUTCMonth = function(monthValue, dayValue) {
    this._setUTCPersianDate(1, monthValue + 1, dayValue);
};
/**
 * The Date.toLocaleString() method can return a string with a language sensitive representation of this date,
 * so we change it to return date in Jalali calendar
 */
JDate.prototype.toLocaleString = function() {
    return digits_en2fa(this.getFullYear() + "/" + pad2(this.getMonth() + 1) + "/" + pad2(this.getDate()) + " ساعت: " +
        pad2(this.getHours()) + ":" + pad2(this.getMinutes()) + ":" + pad2(this.getSeconds()));
};
/**
 * The Date.now() method returns the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC.
 */
JDate.now = Date.now;
/**
 * parses a string representation of a date, and returns the number of milliseconds since January 1, 1970, 00:00:00 UTC.
 */
JDate.parse = function(string) {
    new JDate(string).getTime();
};
/**
 * The Date.UTC() method accepts the same parameters as the longest form of the constructor, and returns the number of
 * milliseconds in a Date object since January 1, 1970, 00:00:00, universal time.
 */
JDate.UTC = function(year, month, date, hours, minutes, seconds, milliseconds) {
    const d = jd_to_gregorian(persian_to_jd_fixed(year, month + 1, date));
    return Date.UTC(d[0], d[1] - 1, d[2], hours || 0, minutes || 0, seconds || 0, milliseconds || 0);
};
// Proxy all time-related methods to internal date object
let i, dateProps = ("getHours getMilliseconds getMinutes getSeconds getTime getUTCDay getUTCHours " +
    "getTimezoneOffset getUTCMilliseconds getUTCMinutes getUTCSeconds setHours setMilliseconds setMinutes " +
    "setSeconds setTime setUTCHours setUTCMilliseconds setUTCMinutes setUTCSeconds toDateString toISOString " +
    "toJSON toString toLocaleDateString toLocaleTimeString toTimeString toUTCString valueOf getDay")
    .split(" "),
    createWrapper = function(k) {
        return function() {
            return this._d[k].apply(this._d, arguments);
        };
    };

for (i = 0; i < dateProps.length; i++) {
    JDate.prototype[dateProps[i]] = createWrapper(dateProps[i]);
}
// Export `JDate` class to global scope

export default JDate;
