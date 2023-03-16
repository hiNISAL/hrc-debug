"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appear = void 0;
const appear = (data, server) => {
    return new Promise((resolve) => {
        wx.request({
            url: server,
            data: data,
            method: 'POST',
            header: {
                'content-type': 'application/json',
            },
            success() {
                resolve();
            },
        });
    });
};
exports.appear = appear;
