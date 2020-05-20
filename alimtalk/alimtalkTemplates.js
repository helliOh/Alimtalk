exports.cancel = (param) =>{
    const { phone, amount, merchantUid, productName } = param;

    if(typeof param != 'object') throw 'cancel template failed : param should be an object';
    if(!amount) throw 'cancel template failed : param should have amount';
    if(isNaN(amount)) throw 'cancel template failed : amount should be a number';
    if(!merchantUid) throw 'cancel template failed : param should have merchantUid';
    if(!productName) throw 'cancel template failed : param should have productName'

    const tmplId = '$cancel';
    const msg = 
    '[템플릿1] 결제 취소\n' +
    '\n' +
    `${productName}의 결제가 취소되었습니다.\n` +
    '\n' +
    `* 주문번호: ${merchantUid}\n `+ 
    `* 취소상품: ${productName}\n` +
    `* 취소금액: ${Number(amount)}\n` +
    '\n' +
    '상세 결제 내역은 마이페이지 및 이메일에서 확인하실 수 있습니다.\n' +
    '감사합니다!';

    return {
        phn : phone,
        tmplId : tmplId,
        msg : msg,
        msgSms : msg,
        button1 : {
            name : '결제내역 바로가기',
            type :  'WL',
            url_pc : 'http://www.google.com',
            url_mobile : 'http://www.google.com'
        }
    };
}

exports.change = (param) =>{
    const { phone, merchantUid, productName } = param;

    if(typeof param != 'object') throw 'change template failed : param should be an object';
    if(!merchantUid) throw 'change template failed : param should have merchantUid';
    if(!productName) throw 'change template failed : param should have productName';

    const tmplId = '$change';
    const msg = 
    '[템플릿2] 교환 접수\n' +
    '\n' + 
    `${productName}의 교환 신청이 접수되었습니다.\n` +
    '\n' + 
    `* 주문번호: ${merchantUid}\n` +
    `* 교환상품: ${productName}\n` +
    '\n' + 
    '상세 결제 내역은 마이페이지 및 이메일에서 확인하실 수 있습니다.\n' +
    '감사합니다!';

    return {
        phn : phone,
        tmplId : tmplId,
        msg : msg,
        msgSms : msg,
        button1 : {
            name : '결제내역 바로가기',
            type :  'WL',
            url_pc : 'http://www.google.com',
            url_mobile : 'http://www.google.com'
            
        }
    };
}

exports.findId = (param) =>{
    const { phone, id } = param;
    if(!id) throw 'findId template failed : id should be passed into context';

    const tmplId = '@findId';
    const msg = 
    '[템플릿3] 아이디 찾기\n' +
    '\n' + 
    `회원님의 아이디는 ${id} 입니다.`

    return {
        phn : phone,
        tmplId : tmplId,
        msg : msg,
        msgSms : msg,
        button1 : {
            name : '브라우저 바로가기',
            type :  'WL',
            url_pc : 'http://www.google.com',
            url_mobile : 'http://www.google.com'
        }
    };
}

exports.findPassword = (param) =>{
    const { phone, password } = param;
    if(!password) throw 'findPassword template failed : password should be passed into context';

    const tmplId = '@findPassword';
    const msg = 
    '[템플릿4] 비밀번호 찾기\n' +
    '\n' +
    `회원님의 비밀번호가 ${password}로 초기화되었습니다.\n` +
    '로그인 후 비밀번호를 변경해주세요.';

    return {
        phn : phone,
        tmplId : tmplId,
        msg : msg,
        msgSms : msg,
        button1 : {
            name : '브라우저 바로가기',
            type :  'WL',
            url_pc : 'http://www.google.com',
            url_mobile : 'http://www.google.com'
        }
    };
}

exports.paid = (param) =>{
    const { phone, amount, merchantUid, productName } = param;

    if(typeof param != 'object') throw 'paid template failed : param should be an object';
    if(!amount) throw 'paid template failed : param should have amount';
    if(isNaN(amount)) throw 'paid template failed : amount should be a number';
    if(!merchantUid) throw 'paid template failed : param should have merchantUid';
    if(!productName) throw 'paid template failed : param should have productName';

    const tmplId = '@paid';
    const msg = 
    '[템플릿5] 결제 완료\n' +
    '\n' + 
    `${productName}의 결제가 완료되었습니다.\n` +
    '\n' + 
    `* 주문번호: ${merchantUid}\n` +
    `* 상품명: ${productName}\n` +
    `* 결제금액: ${Number(amount).toLocaleString()}원\n` +
    '\n' + 
    '상세 결제 내역은 마이페이지 및 이메일에서 확인하실 수 있습니다.\n' +
    '빠른 시일 내에 고객님께 전달 드리도록 하겠습니다. 감사합니다!';

    return {
        phn : phone,
        tmplId : tmplId,
        msg : msg,
        msgSms : msg,
        button1 : {
            name : '결제내역 바로가기',
            type :  'WL',
            url_pc : 'http://www.google.com',
            url_mobile : 'http://www.google.com'
        }
    };
}

exports.refund = (param) =>{
    const { phone, amount, merchantUid, productName } = param;

    if(typeof param != 'object') throw 'refund template failed : param should be an object';
    if(!amount) throw 'refund template failed : param should have amount';
    if(isNaN(amount)) throw 'refund template failed : amount should be a number';
    if(!merchantUid) throw 'refund template failed : param should have merchantUid';
    if(!productName) throw 'refund template failed : param should have productName';

    const tmplId = '@refund';
    const msg = 
    '[템플릿6] 반품 접수\n' +
    '\n' + 
    `${productName}의 반품 신청이 접수되었습니다.\n` +
    '\n' + 
    `* 주문번호: ${merchantUid}\n` +
    `* 취소상품: ${productName}\n` +
    `* 취소금액: ${Number(amount).toLocaleString()}원\n` +
    '\n' + 
    '상세 결제 내역은 마이페이지 및 이메일에서 확인하실 수 있습니다.\n' +
    '감사합니다!';

    return {
        phn : phone,
        tmplId : tmplId,
        msg : msg,
        msgSms : msg,
        button1 : {
            name : '결제내역 바로가기',
            type :  'WL',
            url_pc : 'http://www.google.com',
            url_mobile : 'http://www.google.com'
        }
    }
}

exports.verification = (param) =>{
    const { phone, code } = param;

    if(!code) throw `verification template failed : code is missing.`;
    if (isNaN(code)) throw `verification template failed : code should be number.`;
    if(code.length != 6) throw `verification template failed : code should be 6 digits.`; 

    const tmplId = '@verification';
    const msg = `[루쏘로프] 본인확인 인증번호(${code})를 입력해주세요.`;

    return {
        phn : phone,
        tmplId : tmplId,
        msg : msg,
        msgSms : msg
    };
}


