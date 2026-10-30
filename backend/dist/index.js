"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const port = Number(process.env.PORT || env_1.env.PORT) || 5000;
if (process.env.NODE_ENV !== 'test') {
    app_1.app.listen(port, '0.0.0.0', () => {
        console.log(`[SentinelTrust AI] Security, Privacy & Trust Intelligence API running on http://0.0.0.0:${port}/api/v1`);
    });
}
exports.default = app_1.app;
