// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID;
    const db = cloud.database();
    const _ = db.command;

    // role has to be one of ['student', 'faculty', 'admin']
    const {
        gtid,
        email,
        password,
        role
    } = event;

    let condition;
    if (role === 'student') {
        condition = {
            role: role,
            gtid: gtid
        };
    } else if (role === 'faculty'||role == 'staff') {
        condition = {
            role: role,
            email: email
        }
    } else if (role === 'admin') {
        condition = {
            role: role,
            email: email,
            password: password
        }
    }
    if(role=="staff"){
        return {
            code: true,
        }
    }

    // step 1: check if user is in the whitelist
    const userRes = await db.collection('whitelist').where(condition).get();
    if (userRes.data.length === 0) {
        return {
            code: false,
            message: 'You are not registered in the system. Please contact library admin 赵三乐.'
        };
    }
    if (userRes.data[0].password !== password) {
        return {
            code: false,
            message: "Wrong password. Please try again."
        }
    }

    const res = await db.collection('users').where(condition).get();

    if (res.data.length !== 0) {
        await db.collection('users').where({
            openid: openid
        }).update({
            data: {
                login: true
            }
        });
        return {
            code: true,
            user: {
                ...res.data,
                login: true
            }
        }
    }

    try {
        const data = {
            openid: openid,
            gtid: gtid,
            email: email,
            password: password,
            role: role,
            login: true,
            borrowRecords: [],
            followList:[],
            scheduleList:[]
        }
        await db.collection('users').add({
            data: data
        });
        return {
            code: true,
            user: data
        };
    } catch (e) {
        console.error("createUser failed", e);
        return {
            code: false,
            message: 'Login failed. Try Later.'
        };
    }
}