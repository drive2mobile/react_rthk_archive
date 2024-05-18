const downloadURLSample = "https://rthkaod2022.akamaized.net/m4a/radio/archive/STATION/PROGRAM/m4a/DATE.m4a/";
const downloadM3u8Suffix = "index_0_a.m3u8?";
const jsonFileSuffix = "?date=20240422";
const hostURL = "https://rthk-archive.vercel.app";
// const hostURL = process.env.PUBLIC_URL;
const weekdayList = [
    {
        "weekday_id": "0",
        "weekday_name_tc": "星期日",
        "weekday_name_sc": "星期日",
        "weekday_name_en": "SUN"
    },
    {
        "weekday_id": "1",
        "weekday_name_tc": "星期一",
        "weekday_name_sc": "星期一",
        "weekday_name_en": "MON"
    },
    {
        "weekday_id": "2",
        "weekday_name_tc": "星期二",
        "weekday_name_sc": "星期二",
        "weekday_name_en": "TUE"
    },
    {
        "weekday_id": "3",
        "weekday_name_tc": "星期三",
        "weekday_name_sc": "星期三",
        "weekday_name_en": "WED"
    },
    {
        "weekday_id": "4",
        "weekday_name_tc": "星期四",
        "weekday_name_sc": "星期四",
        "weekday_name_en": "THU"
    },
    {
        "weekday_id": "5",
        "weekday_name_tc": "星期五",
        "weekday_name_sc": "星期五",
        "weekday_name_en": "FRI"
    },
    {
        "weekday_id": "6",
        "weekday_name_tc": "星期六",
        "weekday_name_sc": "星期六",
        "weekday_name_en": "SAT"
    }
];
const stationList = [
    {
        "station_id": "radio1",
        "station_name_tc": "第一台",
        "station_name_sc": "第一台",
        "station_name_en": "Radio 1"
    },
    {
        "station_id": "radio2",
        "station_name_tc": "第二台",
        "station_name_sc": "第二台",
        "station_name_en": "Radio 2"
    },    
    {
        "station_id": "radio3",
        "station_name_tc": "第三台",
        "station_name_sc": "第三台",
        "station_name_en": "Radio 3"
    },    
    {
        "station_id": "radio4",
        "station_name_tc": "第四台",
        "station_name_sc": "第四台",
        "station_name_en": "Radio 4"
    },    
    {
        "station_id": "radio5",
        "station_name_tc": "第五台",
        "station_name_sc": "第五台",
        "station_name_en": "Radio 5"
    }
]

export { downloadURLSample, downloadM3u8Suffix, jsonFileSuffix, weekdayList, stationList, hostURL }