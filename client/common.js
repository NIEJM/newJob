/*配置服务器地址*/
var config = {
	server_url:'http://www.hiiiclass.com/flt/v1',
	BASE_URL:'/flt-admin/',
	upload_url:'http://www.hiiiclass.com/flt/v1/resource/upload',
	accessToken:store.get('accessToken')||''
};
/*表单序列化*/
$.fn.serializeObject = function(){
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};
//重新登录
function reLogin() {
	layer.msg('请重新登录', {
			time: 2000
		},
		function() {
			top.location.href = "login.html";
		});

};
/**
 @Name：laytpl-v1.1 精妙的js模板引擎
 @Author：贤心 - 2014-08-16
 @Site：http://sentsin.com/layui/laytpl
 @License：MIT license
 */
;!function(){"use strict";var f,b={open:"{{",close:"}}"},c={exp:function(a){return new RegExp(a,"g")},query:function(a,c,e){var f=["#([\\s\\S])+?","([^{#}])*?"][a||0];return d((c||"")+b.open+f+b.close+(e||""))},escape:function(a){return String(a||"").replace(/&(?!#?[a-zA-Z0-9]+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#39;").replace(/"/g,"&quot;")},error:function(a,b){var c="Laytpl Error：";return"object"==typeof console&&console.error(c+a+"\n"+(b||"")),c+a}},d=c.exp,e=function(a){this.tpl=a};e.pt=e.prototype,e.pt.parse=function(a,e){var f=this,g=a,h=d("^"+b.open+"#",""),i=d(b.close+"$","");a=a.replace(/[\r\t\n]/g," ").replace(d(b.open+"#"),b.open+"# ").replace(d(b.close+"}"),"} "+b.close).replace(/\\/g,"\\\\").replace(/(?="|')/g,"\\").replace(c.query(),function(a){return a=a.replace(h,"").replace(i,""),'";'+a.replace(/\\/g,"")+'; view+="'}).replace(c.query(1),function(a){var c='"+(';return a.replace(/\s/g,"")===b.open+b.close?"":(a=a.replace(d(b.open+"|"+b.close),""),/^=/.test(a)&&(a=a.replace(/^=/,""),c='"+_escape_('),c+a.replace(/\\/g,"")+')+"')}),a='"use strict";var view = "'+a+'";return view;';try{return f.cache=a=new Function("d, _escape_",a),a(e,c.escape)}catch(j){return delete f.cache,c.error(j,g)}},e.pt.render=function(a,b){var e,d=this;return a?(e=d.cache?d.cache(a,c.escape):d.parse(d.tpl,a),b?(b(e),void 0):e):c.error("no data")},f=function(a){return"string"!=typeof a?c.error("Template not found"):new e(a)},f.config=function(a){a=a||{};for(var c in a)b[c]=a[c]},f.v="1.1","function"==typeof define?define(function(){return f}):"undefined"!=typeof exports?module.exports=f:window.laytpl=f}();

var businessHeader = function(xhr){
	if(config.accessToken){
		xhr.setRequestHeader("Authorization", "Bearer " + config.accessToken);
	}else{
		reLogin();
	}
}
/*工具类*/
var tools = {
	/*获取当前URL中的参数*/
	getQueryString:function(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return '';
	},
	encodeParam:function(param){
		return encodeURI(encodeURI(param));
	},
	decodeParam:function(param){
		return decodeURI(param);
	},
	goto:function(url){
		location.href = url ;
	},
	ajaxRequest:function(option){
		var opt = {
			type: option.type || 'get',
			contentType: option.contentType || 'application/json',
			sync: option.sync || true,
			data: option.data || {},
			memo: option.memo || '',
			url: config.server_url + option.url,
			callback: option.callback || 'defcallback',
			accessToken: option.bool || false
		};

		var _this_ = this;
		$.ajax({
			type : opt.type ,
			contentType: opt.contentType ,
			sync: opt.sync,
			data: opt.data,
			url : opt.url ,
			success : function (data,status, res) {
				if(opt.callback=='defcallback'){
					layer.msg('完成');
				}else{
					var reg = /^20\d{1}$/;
					// data = _this_.isJson(data);

					if(reg.test(res.status)){
						opt.callback(data,res.status,res);
					}
				}
			},
			error:function(e){
				console.log(e);
				layer.msg(opt.memo + "失败" , {icon: 5});
				if (e.status == 401) {
					reLogin();
				}
			},
			beforeSend:function(xhr){
				businessHeader(xhr);
				// if(opt.accessToken){
				// 	xhr.setRequestHeader("accessToken", config.accessToken);
				// }
			}
		});
	},
	isJson:function(obj){
		var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
		return isjson ? obj : eval('('+ obj +')');
	},
	/*base64加密*/
	base64_encode:function(str){
		var c1, c2, c3;
		var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var i = 0, len= str.length, string = '';

		while (i < len){
			c1 = str.charCodeAt(i++) & 0xff;
			if (i == len){
				string += base64EncodeChars.charAt(c1 >> 2);
				string += base64EncodeChars.charAt((c1 & 0x3) << 4);
				string += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if (i == len){
				string += base64EncodeChars.charAt(c1 >> 2);
				string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
				string += base64EncodeChars.charAt((c2 & 0xF) << 2);
				string += "=";
				break;
			}
			c3 = str.charCodeAt(i++);
			string += base64EncodeChars.charAt(c1 >> 2);
			string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
			string += base64EncodeChars.charAt(c3 & 0x3F)
		}
		return string
	},
	/*base64解密*/
	base64_decode:function(str){
		var c1, c2, c3, c4;
		var base64DecodeChars = new Array(
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
			58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0,  1,  2,  3,  4,  5,  6,
			7,  8,  9,  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
			25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
			37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
			-1, -1
		);
		var i=0, len = str.length, string = '';

		while (i < len){
			do{
				c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
			} while (
				i < len && c1 == -1
				);

			if (c1 == -1) break;

			do{
				c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
			} while (
				i < len && c2 == -1
				);

			if (c2 == -1) break;

			string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

			do{
				c3 = str.charCodeAt(i++) & 0xff;
				if (c3 == 61)
					return string;

				c3 = base64DecodeChars[c3]
			} while (
				i < len && c3 == -1
				);

			if (c3 == -1) break;

			string += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

			do{
				c4 = str.charCodeAt(i++) & 0xff;
				if (c4 == 61) return string;
				c4 = base64DecodeChars[c4]
			} while (
				i < len && c4 == -1
				);

			if (c4 == -1) break;

			string += String.fromCharCode(((c3 & 0x03) << 6) | c4)
		}
		return string;
	},
	//图片上传
	fileUpload:function(picker,imgbox,uploadfile_hidden){
		var uploader = WebUploader.create({
			resize: false,
			disableGlobalDnd:true,
			swf: config.base_url + '/js/webuploader/Uploader.swf',
			server: config.upload_url,
			pick:{multiple:false,id:picker},
			accept:{title: 'Images',extensions: 'jpg,png',mimeTypes: 'image/*'},
			auto:true,
			fileSingleSizeLimit:3145728
		});

		uploader.on( 'uploadSuccess', function( file,response) {
			console.log("success");
			imgbox.attr('data-id',file.id);
			var img = response.result[0].uuid+"."+response.result[0].suffix;
			imgbox.html('<img src="'+response.result[0].access+'" width="100%" id="picUrl_view">');
			uploadfile_hidden.val(response.result[0].access);
		});

		uploader.on( 'error', function(type) {
			console.log("error");
			var str='';
			switch (type){
				case 'Q_TYPE_DENIED':
					str = '文件格式错误,文件格式只能是jpg,png！';
					break;
				case 'Q_EXCEED_NUM_LIMIT':
					str = '文件个数超过限制了！';
					break;
				case 'Q_EXCEED_SIZE_LIMIT':
					str = '单个文件大小超过限制了！';
					break;
			}
			layer.msg(str);
		});

		uploader.on( 'uploadBeforeSend', function(object,data,headers) {
			headers['Authorization'] = "bearer "+ config.accessToken;
		});
	}
};
/*判断是否为空*/
function isNull(obj){
	if(obj=="0"){
		return 0;
	}
	if(obj==null||obj==''||obj=='undefined'){
		return '';
	}else{
		return obj;
	}
}
/*判断订单状态*/
function orderStatus(status){
	var str = "";
	if(isNull(status)!=''){
		switch(status){
			case 'TO_BE_PAID': str = "待支付";
				break;
			case 'PENDING_CONFIRMATION': str = "待确认";
				break;
			case 'WAIT_FOR_COMPLETION': str = "待上课";
				break;
			case 'FINISHED': str = "已完成";
				break;
			case 'REJECTED': str = "已拒单";
				break;
			case 'USER_CANCELED': str = "学生取消";
				break;
			case 'ADMIN_CANCELED': str = "后台取消";
				break;
			case 'CANCEL_PAYMENT': str = "取消支付";
				break;
			default: str = "非法状态";
				break;
		}
	}
	return str;
}
function orderInfo(status){
	var str = "";
	if(isNull(status)!=''){
		switch(status){
			case 'TO_BE_PAID': str = "学生创建了订单，等待支付";
				break;
			case 'PENDING_CONFIRMATION': str = "学生提交了订单，等待教师确认";
				break;
			case 'WAIT_FOR_COMPLETION': str = "教师确认接单，等待上课";
				break;
			case 'FINISHED': str = "课程已完成";
				break;
			case 'REJECTED': str = "教师拒绝接单";
				break;
			case 'USER_CANCELED': str = "学生取消订单";
				break;
			case 'ADMIN_CANCELED': str = "原订单由后台取消";
				break;
			case 'CANCEL_PAYMENT': str = "学生取消支付订单";
				break;
			default: str = "非法状态";
				break;
		}
	}
	return str;
}
/*获取当前时间的时间戳*/
function getTimestamp(){
	return new Date().getTime();
}
/*时间戳转YYYY-MM-DD HH:mm:ss格式*/
function tStamp2Normal(ts,type){
	if(isNull(ts)==''){
		return '';
	}
	var weekC = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
	var weekE = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var date = new Date(ts);
	var Y = date.getFullYear();
	var M = '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
	var MC = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
	var ME = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
	var D = '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	var DC = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日 ';
	var DE = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	var WC = weekC[date.getDay()];
	var WE = weekE[date.getDay()];
	var H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
	var m = ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
	var s = ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	switch(type){
		case 'all':var formatDate = Y + M + D + H + m + s;break;
		case 'date':var formatDate = Y + M + D;break;
		case 'time':var formatDate = H + m;break;
		case 'times':var formatDate = H + m + s;break;
		case 'WC':var formatDate = MC + DC + WC;break;
		case 'WE':var formatDate = ME + DE + WE;break;
		case 'H':var formatDate = H;break;
		default:var formatDate = Y + M + D + H + m + s;break;
	}
	
	return formatDate;
}
function time2Stamp(time){
	var H = parseInt(time.split(':')[0]);
	var M = parseInt(time.split(':')[1]);
	var h = (H-8)*3600000;
	var m = M*60000;
	return h+m;
}
/*初始化表头与表尾*/
function setHaF(){
	var HaFTmp = $("#HaFTmp").html();
	$("#thead").html(HaFTmp);
	$("#tfoot").html(HaFTmp);
}
/*
引自http://blog.csdn.net/kongjiea/article/details/42643091
*/
function I2D(x) {	
	if (x == null) {
		return '';
	}
	var f = parseFloat(x);
	if (isNaN(f)) {
		return "NaN";
	}
	var f = Math.round(x*100)/100;
	var s = f.toString();
	var rs = s.indexOf('.');
	if (rs < 0) {
		rs = s.length;
		s += '.';
	}
	while (s.length <= rs + 2) {
		s += '0';
	}
	return s;
}
/*判断性别*/
function isMale(male){
	var gender = '';
	switch(male){
		case 'MALE': gender = '男';break;
		case 'FEMALE': gender = '女';break;
		default: gender = '';break;
	}
	return gender;
}
/*判断服务对象*/
function serObj(serObj){
	var serviceObject = '';
	switch(serObj){
		case 'ALL': serviceObject = '所有';break;
		case 'CHILD': serviceObject = '少儿口语';break;
		case 'ADULT': serviceObject = '成人口语';break;
		default: serviceObject = '';break;
	}
	return serviceObject;
}
/*头像*/
function image(img){
	var src = isNull(img)==''?'images/image.png':img;
	return src;
}
/*百度地图api，通过地址查询经纬度*/
function searchByStationName() {
	var myGeo = new BMap.Geocoder();
	var keyword = $("#address").val();
	myGeo.getPoint(keyword, function(point){
		if (point) {
			$("#longitude").val(point.lng);
			$("#latitude").val(point.lat);
		}else{
			$("#longitude").val("");
			$("#latitude").val("");
		}
	});
}
/*判断地理编码结果*/
function geocoderResult(e,callback,status,result){
	// console.log(status);
	if (status === 'complete' && result.info === 'OK') {
		if(callback){
			e.after('<i style="color:blue;">已获取经纬度</i>');
			geocoder_CallBack(result);
		}else{
			e.after('<i style="color:blue;">地址信息正确</i>');
		}
	}else{
		if(callback){
			$("#longitude").val("");
			$("#latitude").val("");
			e.after('<i style="color:red;">地址信息有误</i>');
		}else{
			e.after('<i style="color:red;">地址信息有误</i>');
		}
		
	}
}
/*高德地图API，通过地址查询经纬度*/
function geocoder(e,callback) {
	var geocoder = new AMap.Geocoder({
		city: "上海", //城市，默认：“全国”
		radius: 500 //范围，默认：500
	});
	var keyword = e.val();
	//地理编码,返回地理编码结果
	geocoder.getLocation(keyword, function(status, result) {
		geocoderResult(e,callback,status,result);
	});
}
function geocoder_CallBack(data) {
	//地理编码结果数组
	var geocode = data.geocodes;
	for (var i = 0; i < geocode.length; i++) {
		//拼接输出html
		$("#longitude").val(geocode[i].location.getLng());
		$("#latitude").val(geocode[i].location.getLat());
	}
}
function logout(){
	var option = {
		type: "get",
		contentType: "application/json",
		memo: "注销",
		url: "/oauth/revoke-token?",
		callback: function(data, status, res){
			window.location.href = "login.html";
		}
	};
	tools.ajaxRequest(option);
}