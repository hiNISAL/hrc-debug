"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appear = void 0;
const appear = (log, server) => {
    fetch(server, {
        method: 'POST',
        body: JSON.stringify({
            console: log,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
exports.appear = appear;
