const Alimtalk = require('./alimtalk');

async function routineSendMessage(){
    const code = 123456;//Random 6-digit number
    const password = 'RANDOM PASSWORD';
    const phone = '01037685728';//Your phone

    const cancelReport = await Alimtalk.sendMessage('cancel', {
      phone : phone,
      amount : 123456,
      merchantUid : '취소 테스트 주문번호',
      productName : '취소 테스트 상품명'
    });

    const changeReport = await Alimtalk.sendMessage('change', {
      phone : phone,
      merchantUid : '교환 테스트 주문번호',
      productName : '교환 테스트 상품명'
    });

    const findIdReport = await Alimtalk.sendMessage('findId', {
      phone : phone,
      id : '테스트@이메일.껌!'
    });

    const findPasswordReport = await Alimtalk.sendMessage('findPassword', {
      phone : phone,
      password : password
    });

    const paidReport = await Alimtalk.sendMessage('paid', {
      phone : phone,
      amount : 123456,
      merchantUid : '결제완료 테스트 주문번호',
      productName : '결제완료 테스트 상품명'
    });

    const refundReport = await Alimtalk.sendMessage('refund', {
      phone : phone,
      amount : 123456,
      merchantUid : '반품접수 테스트 주문번호',
      productName : '반품접수 테스트 상품명'
    });

    const verificationReport = await Alimtalk.sendMessage('verification', {
      phone : phone,
      code : code
    });

    console.log({
        cancel : cancelReport,
        change : changeReport,
        findId : findIdReport,
        findPassword : findPasswordReport,
        paid : paidReport,
        refund : refundReport,
        verification : verificationReport 
    });
}

async function routineReportBalance(){
    let report = await Alimtalk.reportBalance();
    console.log(report);
}

routineSendMessage();
routineReportBalance();