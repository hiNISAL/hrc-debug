"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appear = void 0;
const appear = (data, server) => {
    wx.request({
        url: server,
        data: data,
        method: 'POST',
        header: {
            'content-type': 'application/json',
        },
    });
};
exports.appear = appear;
