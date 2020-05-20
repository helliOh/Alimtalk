const API = require('./alimtalkAPI.js');
const templates = require('./alimtalkTemplates.js');

const allowedTemplates = [
    'cancel', 
    'change', 
    'findId',
    'findPassword',
    'paid',
    'refund',
    'stockCheck',
    'stockTimeout',
    'verification'
];

exports.sendMessage = async (templateName, data) =>{
    return new Promise(async (resolve, reject) =>{
        try{
            if(typeof templateName != 'string') throw 'Alimtalk failed : templateName should be string';
            if(typeof data != 'object') throw 'Alimtalk failed : data should be object';
            if(allowedTemplates.indexOf(templateName) == -1) throw 'Alimtalk failed : invalid templateName';
            if(!data.phone) throw 'Alimtalk failed : data should be contained phone';

            const templateBuilder = templates[templateName];//템플릿 빌더 로딩
            const template = templateBuilder(data);//템플릿 생성 및 오브젝트 키 매핑
            const report = await API.sendMessage(template);//API 호출

            resolve(report);
        }
        catch(e){
            console.log('Alimtalk sendMessage Failed::');
            reject(e);
        } 
    })
}

exports.reportBalance = async () =>{
    return new Promise(async (resolve, reject) =>{
        try{
            const report = await API.reportBalance();//API 호출
            resolve(report);
        }
        catch(e){
            console.log('Alimtalk reportBalance Failed::');
            reject(e);
        } 
    })
}