module.exports = [
	{
		input: 'release/src/index.js',
		output: {
			file: './release/hrc-debug.js',
			format: 'umd',
			name: 'HRCDebug',
		},
	},
	{
		input: 'release/src/appears/browser.js',
		output: {
			file: './release/appears/browser.js',
			format: 'umd',
			name: 'BrowserAppear',
		},
	},
	{
		input: 'release/src/appears/miniprogram.wx.js',
		output: {
			file: './release/appears/miniprogram.wx.js',
			format: 'umd',
			name: 'MiniprogramWechatAppear',
		},
	}
];
