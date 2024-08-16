
/**
 * 转int
 * @param str
 * @returns {number|number}
 */
function intval(str) {
	let n = parseInt(str);
	return isNaN(n) ? 0 : n;
}

function in_array(search,array){
	for(var i in array){
		if(array[i]==search){
			return true;
		}
	}
	return false;
}

/**
 * 从对象中获得属性，适用于JSON对象
 * @param key
 * @param obj
 * @returns {*|null}
 */
function get_from_object(key, obj) {
	for(let key in obj) {
		return obj.hasOwnProperty(key);
	}
	return null;
}

/**
 * 全角字符截图，好像不好使，有空检查下
 * @param str
 * @param start
 * @param n
 * @returns {string|*}
 */
function substr_double(str, start, n) { // eslint-disable-line
	if (str.replace(/[u4e00-u9fa5]/g, '**').length <= n) {
		return str;
	}
	let len = 0;
	let tmpStr = '';
	for (let i = start; i < str.length; i++) { // 遍历字符串
		if (/[u4e00-u9fa5]/.test(str[i])) { // 中文 长度为两字节
			len += 2;
		} else {
			len += 1;
		}
		if (len > n) {
			break;
		} else {
			tmpStr += str[i];
		}
	}
	return tmpStr;
}

/**
 * 获得GET参数
 * @param key
 * @returns {string|number}
 */
function url_param(key) {
	let cur_url = window.location.href;
	let pattern = new RegExp(`[\?\&]${key}=([^\?\&]+)`, 'i');
	let param_match = cur_url.match(pattern);
	let param = param_match ? param_match[1] : "";
	return param;
}

function htmlEncode(str){
	var temp = "";
	if(str.length == 0) return "";
	temp = str.replace(/&/g,"&amp;");
	temp = temp.replace(/</g,"&lt;");
	temp = temp.replace(/>/g,"&gt;");
	temp = temp.replace(/\s/g,"&nbsp;");
	temp = temp.replace(/\'/g,"&#39;");
	temp = temp.replace(/\"/g,"&quot;");
	return temp;
}

function htmlDecode(str){
	let temp = "";
	if(str.length == 0) return "";
	temp = str.replace(/&amp;/g,"&");
	temp = temp.replace(/&lt;/g,"<");
	temp = temp.replace(/&gt;/g,">");
	temp = temp.replace(/&nbsp;/g," ");
	temp = temp.replace(/&#39;/g,"\'");
	temp = temp.replace(/&quot;/g,"\"");
	return temp;
}

/**
 * 预匹配，去换行，多个空格替换为一个空格
 * @param str
 * @returns {*}
 */
function pre_match(str){
	str = typeof str == 'string' ? str : '';
	str = str.replace(/[\n\r]/gi, '');
	str = str.replace(/\s+/gi, ' ');
	return str;
}

/**
 * 拷贝textarea里的值到剪切板
 * @param elem
 * @returns {boolean}
 */
function cpoyTextarea(elem){
	var disabled = elem.getAttribute('disabled');
	if(disabled != null){//如果textarea设置了这个属性，则无法拷贝成功，所以要先去掉
		elem.removeAttribute('disabled');
	}
	elem.select(); // 选择对象
	document.execCommand("Copy"); // 执行浏览器复制命令
	if(disabled != null){//拷贝完成后，归还原来的disabled
		elem.setAttribute('disabled',disabled);
	}
}

/**
 * ArrayData 数据，只一维对象数组，比如类似数据库中的数据，一维的，其中每一条是个对象，有多个属性
 * 例如可以是这样：[{id:1,name:"aaa"},{id:2,name:"bbb"}]
 * @type {{}}
 */
ArrayData = {};

/**
 * 判断数组中是否有这个对象，根据属性为key的字段
 * @param arr
 * @param obj
 * @param key
 * @returns {boolean}
 */
ArrayData.in = function (arr, obj, key) {
	for(let line of arr) {
		if(line[key] == obj[key]){
			return true;
		}
	}
	return false;
}

/**
 * 向数组里添加一个对象，并根据key进行去重判断，若重复则不添加
 * @param arr
 * @param obj
 * @param key
 */
ArrayData.push = function (arr, obj, key) {
	if(!ArrayData.in(arr, obj, key)){
		arr.push(obj);
	}
}

/**
 * 将数组2合并到数组1，并根据字段key去重
 * @param arr1
 * @param arr2
 * @param key
 */
ArrayData.merge = function (arr1, arr2, key) {
	for(let line of arr2) {
		if(!ArrayData.in(arr1, line, key)){
			arr1.push(line);
		}
	}
}

/**
 * ArrayData取其中一列，并组成数组
 * @param data
 * @param column
 * @returns {*[]}
 */
ArrayData.column = function (data, column) {
	let column_arr = [];
	for(let line of data) {
		column_arr.push(line[column]);
	}
	return column_arr;
}

/**
 * 直到...为止
 * @param params.repeat function 需要重复的事
 * @param params.until function 直到，返回TRUE停止，返回FALSE继续
 * @param params.complete function 任务完成
 * @param params.delay function 延时，默认1秒
 * @param repeat {} 回传的对象，用于接收重试次数，也可以作为变量传递。例如：
 * until : function (repeat) {
 *   if(...){
 *     repeat.code = 200;
 *     return true;
 *   }else if (repeat.time >= 5){
 *     repeat.code = 500;
 *     return true;
 *   }else{
 *     return false;
 *   }
 * },
 * complete : function (repeat) {
 *   if(repeat.code == 200){
 *       ...
 *   }else{
 *       ...
 *   }
 * },
 * @version 230519
 */
function repeatUntil_230519(params){
	if(typeof params.repeat !== "function") params.repeat = function(){};
	if(typeof params.until !== "function") params.until = function(){return false};
	if(typeof params.complete !== "function") params.complete = function(){};
	if(typeof params.delay !== "number") params.delay = 1000;

	let repeat = {};
	repeat.time = 0;
	(function() {
		let func = arguments.callee;//给匿名函数一个局部名称，以便进行递归
		params.repeat(repeat);
		repeat.time++;
		if(params.until(repeat)){
			params.complete(repeat);
		}else{
			setTimeout(function () {
				func();//递归
			},params.delay);
		}
	})();
}

/**
 * 等待JQ对象加载完毕
 * @param jObject
 * @param cb
 */
function jObjectReady(jObject, cb) {
	let jObj;
	repeatUntil({
		repeat : function () {
			jObj = jObject;
		},
		until : function () {
			if((typeof jObj != 'undefined') && (jObj.length > 0) ){
				return true;
			}else{
				return false;
			}
		},
		complete : function () {
			cb(jObj);
		}
	});
}

/**
 * 循环做事，内外部都可控
 * @param params
 * @constructor
 * @version 8220826
 */
function Machine(params){
	if(typeof params.do !== "function") throw new Error('do must a func');
	if(typeof params.done !== "function") params.done = function(){};
	if(typeof params.delay !== "number") params.delay = 1000;
	if(typeof params.auto_run !== "boolean") params.auto_run = true;

	let self = this;
	let order_run = false;
	let t = null;

	this.stop = function(){
		t && clearTimeout(t);
		order_run = false;
	}

	this.complete = function(){
		self.stop();
		params.done();
	}

	function func() {
		let func = arguments.callee;//给匿名函数一个局部名称，以便进行递归
		params.do(self);
		if(order_run){
			t = setTimeout(function () {
				func();//递归
			},params.delay);
		}
	};

	if(params.auto_run){
		order_run = true;
		func();
	}

	this.run = function(){
		if(!order_run){
			order_run = true;
			func();
		}
	}

}



function imageDownByCanvas(imgUrl) {
	let image = new Image();
	// 解决跨域 canvas污染问题
	image.setAttribute('crossOrign', 'anonymous')
	image.onload = function() {
		let canvas = document.createElement('canvas')
		canvas.width = image.width
		canvas.height = image.height
		let context = canvas.getContext('2d')
		context.drawImage(image, 0, 0, image.width, image.height)
		let url = canvas.toDataURL('image/png')  // 图片转为base64格式
		let a = document.createElement('a')
		let e = new MouseEvent('click')
		a.download = '下载图片'
		a.href = url
		a.dispatchEvent(e)
	}
	// imgUrl即为要下载图片的路径
	image.src = imgUrl  + '?time=' + new Date().valueOf() // 加时间戳
}

function onlineFileToBlob(url, cb){
	let xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded;charset=utf-8')
	xhr.responseType = 'blob';
	xhr.onload = function (e) {
		if(this.status == 200){
			cb(this.response);
		}
	}
	xhr.send();
}

/**
 * 网络文件下载为BASE64，如果返回空就是失败了
 * @version 220825
 * @param url
 * @param cb
 */
function onlineFileToBase64(url, cb){
	let xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.responseType = 'blob';
	xhr.onload = function (e) {
		if(this.status == 200){
			let reader = new FileReader();
			reader.readAsDataURL(this.response);
			reader.onload = function(){
				cb(200, reader.result);
			};
		}else{
			cb(this.status, '');
		}
	}
	xhr.send();
}

/**
 * BASE64文件转BLOB
 * @version 220825
 * @param base64Data
 * @returns {Blob}
 */
function base64ToBlob(base64Data) {
	let byteString;
	if(base64Data.split(',')[0].indexOf('base64') >= 0)
		byteString = atob(base64Data.split(',')[1]);//base64 解码
	else{
		byteString = unescape(base64Data.split(',')[1]);
	}
	let mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];//mime类型 -- image/png
	let ia = new Uint8Array(byteString.length);//创建视图
	for(let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	let blob = new Blob([ia], {
		type: mimeString
	});
	return blob;
}

/**
 * BASE64字符串转换为FILE
 * @version 220825
 * @param base64str
 * @param filename
 * @returns {File}
 */
function base64ToFile(base64str, filename) {//将base64转换为文件
	let arr = base64str.split(','), mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	while(n--){
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, {type:mime});
}

/**
 * 下载BLOB
 * @param fileName
 * @param blob
 */
function downBlob(fileName,blob) {
	if (navigator.msSaveBlob) {
		//IE瀏覽器下載
		window.navigator.msSaveOrOpenBlob(blob, fileName);
	}
	let linkNode = document.createElement('a');
	linkNode.download = fileName;
	linkNode.style.display = 'none';
	linkNode.href = URL.createObjectURL(blob)
	document.body.appendChild(linkNode)
	linkNode.click();
	URL.revokeObjectURL(linkNode.href);
	document.body.removeChild(linkNode);
}

/**
 * 保存图片到下载目录，同步
 * 这个是同步的，异步的在下边
 * @param Url 下载地址，不可跨域
 */
function imageDown (Url) {
	let blob=new Blob([''], {type:'application/octet-stream'});
	let url = URL.createObjectURL(blob);
	let a = document.createElement('a');
	a.href = Url;
	a.download = Url.replace(/(.*\/)*([^.]+.*)/ig,"$2").split("?")[0];
	let e = document.createEvent('MouseEvents');
	e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	a.dispatchEvent(e);
	URL.revokeObjectURL(url);
}

