"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appear = void 0;
const appear = (data, server) => {
    return fetch(server, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
exports.appear = appear;
