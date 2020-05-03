/*! jswebrtc v1.0 | (c) Derek Chan | MIT license */


// This sets up the JSWebrtc "Namespace". The object is empty apart from the Now()
// utility function and the automatic CreateVideoElements() after DOMReady.
var JSWebrtc = {

	// The Player sets up the connections between source, demuxer, decoders,
	// renderer and audio output. It ties everything together, is responsible
	// of scheduling decoding and provides some convenience methods for
	// external users.
	Player: null,

	// A Video Element wraps the Player, shows HTML controls to start/pause
	// the video and handles Audio unlocking on iOS. VideoElements can be
	// created directly in HTML using the <div class="jswebrtc"/> tag.
	VideoElement: null,

	CreateVideoElements: function () {
		var elements = document.querySelectorAll('.jswebrtc');
		for (var i = 0; i < elements.length; i++) {
			new JSWebrtc.VideoElement(elements[i]);
		}
	},

	FillQuery: function (query_string, obj) {
		// pure user query object.
		obj.user_query = {};

		if (query_string.length == 0)
			return;

		// split again for angularjs.
		if (query_string.indexOf("?") >= 0)
			query_string = query_string.split("?")[1];

		var queries = query_string.split("&");
		for (var i = 0; i < queries.length; i++) {
			var query = queries[i].split("=");
			obj[query[0]] = query[1];
			obj.user_query[query[0]] = query[1];
		}

		// alias domain for vhost.
		if (obj.domain)
			obj.vhost = obj.domain;
	},

	ParseUrl: function (rtmp_url) {
		// @see: http://stackoverflow.com/questions/10469575/how-to-use-location-object-to-parse-url-without-redirecting-the-page-in-javascri
		var a = document.createElement("a");
		a.href = rtmp_url.replace("rtmp://", "http://")
			.replace("webrtc://", "http://")
			.replace("rtc://", "http://");

		var vhost = a.hostname;
		var app = a.pathname.substr(1, a.pathname.lastIndexOf("/") - 1);
		var stream = a.pathname.substr(a.pathname.lastIndexOf("/") + 1);

		// parse the vhost in the params of app, that srs supports.
		app = app.replace("...vhost...", "?vhost=");
		if (app.indexOf("?") >= 0) {
			var params = app.substr(app.indexOf("?"));
			app = app.substr(0, app.indexOf("?"));

			if (params.indexOf("vhost=") > 0) {
				vhost = params.substr(params.indexOf("vhost=") + "vhost=".length);
				if (vhost.indexOf("&") > 0) {
					vhost = vhost.substr(0, vhost.indexOf("&"));
				}
			}
		}

		// when vhost equals to server, and server is ip,
		// the vhost is __defaultVhost__
		if (a.hostname == vhost) {
			var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
			if (re.test(a.hostname))
				vhost = "__defaultVhost__";
		}

		// parse the schema
		var schema = "rtmp";
		if (rtmp_url.indexOf("://") > 0)
			schema = rtmp_url.substr(0, rtmp_url.indexOf("://"));

		var port = a.port;
		if (!port) {
			if (schema === 'http') {
				port = 80;
			} else if (schema === 'https') {
				port = 443;
			} else if (schema === 'rtmp') {
				port = 1935;
			} else if (schema === 'webrtc' || schema === 'rtc') {
				port = 1985;
			}
		}

		var ret = {
			url: rtmp_url,
			schema: schema,
			server: a.hostname, port: port,
			vhost: vhost, app: app, stream: stream
		};

		JSWebrtc.FillQuery(a.search, ret);

		return ret;
	},

	HttpPost: function (url, data) {
		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
					var respone = JSON.parse(xhr.responseText);
					xhr.onreadystatechange = new Function;
					xhr = null;
					resolve(respone);
				}
			};

			xhr.open("POST", url, true);

			// note: In Internet Explorer, the timeout property may be set only after calling the open()
			// method and before calling the send() method.
			xhr.timeout = 5000;// 5 seconds for timeout
			xhr.responseType = "text";
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(data);
		})

	}
};

// Automatically create players for all found <div class="jswebrtc"/> elements.
if (document.readyState === 'complete') {
	JSWebrtc.CreateVideoElements();
}
else {
	document.addEventListener('DOMContentLoaded', JSWebrtc.CreateVideoElements);
}
