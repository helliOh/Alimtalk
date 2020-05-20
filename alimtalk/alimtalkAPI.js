const axios = require('axios');
const qs = require('qs');

const { userid, userkey, profile } = require('../config/config.json');//알림톡 사용에 필요한 config를 정의해 주세요

const baseURL = `https://alimtalk-api.bizmsg.kr`;

function serialize(json){
    let o = JSON.parse(JSON.stringify(json));
    const keys = Object.keys(o);
    let serialized = [];

    for(i in keys){
        const key = keys[i];

        let param = o[key];
        param.name = key;
        serialized.push(param);
    }

    return serialized;
}

function validate(fields){
    fields = serialize(fields);
    //Required fields check
    let requiredFields = fields.filter(item => item.required);

    for(i in requiredFields){
        let field = fields[i];
        const {name, type, value, minLength, maxLength} = field;
        
        if(value === null) throw `Validation failed : ${name} is REQUIRED FIELD, but passed value is ${value}`;
    }
    //limit check
    for(i in fields){
        let field = fields[i];
        const {name, type, value, minLength, maxLength} = field;

        if(!value) continue;
        else if(type == 'object') continue;

        if(value.length > maxLength || value.length < minLength) throw `Validation failed : ${name} has length limit ${minLength} <= X <= ${maxLength} but passed length of value is ${value.length}`;
    }
}

function map(fields){
    let map = {};

    //Trim empty fields
    for(key in fields){
        const field = fields[key];
        const {type, value, required} = field;
        
        if(!required && (value === null || value === undefined)) continue;

        map[key] = value;
    }

    return map;
}

/* 알림톡 / 친구톡 발송 */
async function sendMessage(param, options){
    return new Promise(async (resolve, reject) =>{
        try{
            const url = `${baseURL}/v2/sender/send`;

            let fields = {
                message_type : {
                    required : true,
                    type : 'String',
                    minLength : 2,
                    maxLength : 2,
                    value : 'AT',
                    description : `메시지 타입(AT: 알림톡, FT: 친구톡) 친구톡의 경우 20 시~08 시 발송 불가`
                },
                phn : {
                    required : true,
                    type : 'String',
                    minLength : 11,
                    maxLength : 15,
                    value : null,
                    description : `사용자 전화번호 (국가코드(82)를 포함한 전화번호)`
                },
                profile : {
                    required : true,
                    type : 'String',
                    minLength : 40,
                    maxLength : 40,
                    value : profile,
                    description : '발신프로필키 (메시지 발송 주체인 카카오톡 채널 등록 후 발급되는 키)'
                },
                reserveDt : {
                    required : true,
                    type : 'String',
                    minLength : 14,
                    maxLength : 14,
                    value : '00000000000000',
                    description : `메시지 예약발송을 위한 시간 값(yyyyMMddHHmmss) (즉시전송 :00000000000000, 예약전송 : 20180601000000)`
                },
                msg : {
                    required : true,
                    type : 'String',
                    minLength : 0,
                    maxLength : 1000,
                    value : null,
                    description : `사용자에게 전달될 메시지(공백 포함 최대 1,000 자) 친구톡 이미지 타입 : 최대 400 자 제한 친구톡 이미지 타입 와이드형 :최대 76 자 제한`
                },
                title : {
                    required : false,
                    type : 'String',
                    minLength : 0,
                    maxLength : 23,
                    value : null,
                    description : '템플릿 내용 중 강조 표기할 핵심 정보 (CBT, 템플릿 검수 가이드 참고)'
                },
                tmplId : {
                    required : false,
                    type : 'String',
                    minLength : 0,
                    maxLength : 25,
                    value : null,
                    description : `메시지 유형을 확인할 템플릿 코드(사전에 승인된 템플릿의 코드) 알림톡의 경우 필수 입력`
                },
                smsKind : {
                    required : false,
                    type : 'String',
                    minLength : 1,
                    maxLength : 1,
                    fixed : true,
                    value : null,
                    description : `문자메시지 전환발송시 SMS/LMS 구분 (S:SMS,L:LMS,M:MMS,N: 발송하지 않음) SMS/LMS 대체발송 상품 이용시 사용 가능 (비즈엠 홈페이지 - 내 정보 - 이용상품에서 설정 가능)`
                },
                msgSms : {
                    required : false,
                    type : 'String',
                    minLength : 0,
                    maxLength : 1000,
                    value : null,
                    description : `카카오 비즈메시지 발송 실패 시 문자메시지 대체 발송을 위한 메시지 내용`
                },
                smsSender : {
                    required : false,
                    type : 'String',
                    minLength : 13,
                    maxLength : 15,
                    value : null,
                    description : `문자메시지 발송을 위한 발신번호 (비즈엠 사이트에 등록 승인된 발신번호)`
                },
                smsLmsTit : {
                    required : false,
                    type : 'String',
                    minLength : 0,
                    maxLength : 120,
                    value : null,
                    description : `LMS(장문 메시지) 발송시 메시지 제목`
                },
                smsOnly : {
                    required : false,
                    type : 'String',
                    minLength : 1,
                    maxLength : 1,
                    value : null,
                    description : `카카오 비즈메시지 발송과 관계 없이 문자메시지 전용 발송 요청 여부(Y: 사용,N: 미사용, 기본값:N) SMS/LMS 대체발송 상품 이용시 사용 가능 (비즈엠 홈페이지 - 내 정보 - 이용상품에서 설정 가능)`
                },
                ad_flag : {
                    required : false,
                    type : 'String',
                    minLength : 1,
                    maxLength : 1,
                    value : null,
                    description : `친구톡 메시지 발송 시 광고성 메시지 필수 표기사항 노출여부 (Y: 노출,N: 노출하지 않음, 기본값 :Y)`
                },
                img_url : {
                    required : false,
                    type : 'String',
                    minLength : 0,
                    maxLength : 2083,
                    fixed : false,
                    value : null,
                    description : `친구톡 발송 시 메시지에 첨부할 이미지 URL [4.2 친구톡 이미지 업로드] 에서 확인 가능`
                },
                img_link : {
                    required : false,
                    type : 'String',
                    minLength : 0,
                    maxLength : 2083,
                    fixed : false,
                    value : null,
                    description : `첨부된 이미지 클릭시 이동할 URL`
                },
                wide : {
                    required : false,
                    type : 'String',
                    minLength : 1,
                    maxLength : 1,
                    value : null,
                    description : `친구톡 이미지 타입 와이드형 사용 여부 (Y: 사용,N: 미사용, 기본값:N)`
                },
                button1 : {
                    required : false,
                    type : 'object',
                    minLength : undefined,
                    maxLength : undefined,
                    value : null,
                    description : `메시지에 첨부할 버튼 1`
                },
                button2 : {
                    required : false,
                    type : 'String',
                    minLength : undefined,
                    maxLength : undefined,
                    value : null,
                    description : `메시지에 첨부할 버튼 2`
                },
                button3 : {
                    required : false,
                    type : 'object',
                    minLength : undefined,
                    maxLength : undefined,
                    value : null,
                    description : `메시지에 첨부할 버튼 3`
                },
                button4 : {
                    required : false,
                    type : 'object',
                    minLength : undefined,
                    maxLength : undefined,
                    value : null,
                    description : `메시지에 첨부할 버튼 4`
                },
                button5 : {
                    required : false,
                    type : 'object',
                    minLength : undefined,
                    maxLength : undefined,
                    value : null,
                    description : `메시지에 첨부할 버튼 5`
                }
            };
            
            if(!param) throw `sendMessage failed : Empty parameter is given`;
            
            for(key in param){
                if(fields[key] != null){
                    fields[key].value = param[key];
                }
            }

            validate(fields);
            if(options && options.showBeforeSend){
                console.log(JSON.stringify({
                    method: 'POST',
                    headers: { 
                        'content-type': 'application/json',
                        'userid' : userid
                    },
                    data: [map(fields)],
                    url : url
                }));
            }
            
            const result = await axios({
                method: 'POST',
                headers: { 
                    'content-type': 'application/json',
                    'userid' : userid
                },
                data: [map(fields)],
                url : url
            });

            resolve(result.data);
        }
        catch(e){
            reject(e);
        }
    });
}

/* 알림톡 / 친구톡 발송 여부 확인 */
async function reportMessage(param, options){
    return new Promise(async (resolve, reject) =>{
        try{
            const url = `${baseURL}/v2/sender/report`;

            let fields = {
                profile : {
                    required : true,
                    type : 'String',
                    minLength : 40,
                    maxLength : 40,
                    value : profile,
                    description : '발신프로필키 (메시지 발송 주체인 카카오톡 채널 등록 후 발급되는 키)'
                },
                msgid : {
                    required : true,
                    type : 'String',
                    minLength : 20,
                    maxLength : 23,
                    value : null,
                    description : `메시지 일련번호(메시지에 대해 고유한 값) [3.2 메시지 전송요청] 응답으로 수신받은 메시지 일련번호`
                },
            };
            
            if(!param) throw `reportMessage failed : Empty parameter is given`;
            
            for(key in param){
                if(fields[key] != null){
                    fields[key].value = param[key];
                }
            }

            validate(fields);

            const form = map(fields);

            if(options && options.showBeforeSend){
                console.log({
                    method: 'GET',
                    headers: { 
                        'content-type': 'application/json',
                        'userid' : userid
                    },
                    url : `${url}?${qs.stringify(form)}`
                });
            }
            
            const result = await axios({
                method: 'GET',
                headers: { 
                    'content-type': 'application/json',
                    'userid' : userid
                },
                url : `${url}?${qs.stringify(form)}`
            });

            resolve(result.data);
        }
        catch(e){
            reject(e);
        }
    });
}

/* 비즈엠 잔고 내역 조회 - 테스트 서버 엔트리 X */
async function reportBalance(options){
    return new Promise(async (resolve, reject) =>{
        try{ 
            const url = `${baseURL}/v1/user/balance`;
    
            if(options && options.showBeforeSend){
                console.log({
                    method: 'GET',
                    headers: { 
                        'content-type': 'application/json',
                        'userid' : userid,
                        'userkey' : userkey
                    },
                    url : url
                });
            }
            
            const result = await axios({
                method: 'GET',
                headers: { 
                    'content-type': 'application/json',
                    'userid' : userid,
                    'userkey' : userkey
                },
                url : url
            });
    
            resolve(result.data);
        }
        catch(e){
            reject(e);
        }
    });
}

module.exports.sendMessage = sendMessage;

module.exports.reportMessage = reportMessage;

module.exports.reportBalance = reportBalance;

