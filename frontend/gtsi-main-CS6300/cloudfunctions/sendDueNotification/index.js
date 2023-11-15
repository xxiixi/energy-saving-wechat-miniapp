// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const templateID = 'c8204cxUyhISFXPh0dV5cPxwUncW5pjvYx1W6ezBgPI';


/**
 * 定时发送订阅消息
 * 定时查询到期的图书，给用户发送微信提醒
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();

    try {
        // TODO: change openid to each user's real openid
        const result = await cloud.openapi.subscribeMessage.send({
            "touser": wxContext.OPENID,
            "page": 'pages/borrowRecords/index',
            "lang": 'zh_CN',
            "data": {
                "date1": {
                    "value": '2022年12月22日'
                },
                "number2": {
                    "value": '2'
                },
                "thing3": {
                    "value": '《Python 从入门到精通》'
                },
                "thing4": {
                    "value": '您借阅的图书已到期，请及时归还，谢谢。'
                }
            },
            "templateId": templateID,
            "miniprogramState": 'developer'
        });
        return result.errCode;
    } catch (err) {
        return err
    }
}