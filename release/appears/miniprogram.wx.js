"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appear = void 0;
const appear = (log, server) => {
    wx.request({
        url: server,
        data: {
            console: log,
        },
        method: 'POST',
        header: {
            'content-type': 'application/json',
        },
    });
};
exports.appear = appear;
