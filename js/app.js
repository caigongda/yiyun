/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
 var uploadurl="http://www.woaiyiyun.com/";
 var myurl="http://admin.woaiyiyun.com/";
 var imgurl="http://admin.woaiyiyun.com/";
 function yyajax(url,data,callback){
	 mui.ajax(myurl+url,{
		data:data,
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			if(data.code==403){
				mui.toast("您的账号已在另一台设备登录！");
				localStorage.clear();
				plus.runtime.restart();
			}else{
				callback(data);
			}
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			mui.hideLoading();
			mui.toast("网络错误");
			console.log(JSON.stringify(errorThrown));
		}
	});
 }
 function sendcode(phone,type,cb){
	 yyajax('index/user/sms',{phone:phone,type:type},function(res){
		 cb(res);
	 })
 }
 function getchild(place,id){
	 var child=[];
	 for(var i=0;i<place.length;i++){
		  if(place[i].pid==id){
				child.push({
					value:place[i].id,
					text:place[i].name
				});
			}
	 }
	 return child;
 }
 function getinfo(cb){
	 var userinfo=app.getState();
	 yyajax("index/user/siteinfo",{id:userinfo.id,role:userinfo.role,token:userinfo.token},function(res){
		 console.log(JSON.stringify(res));
		 app.setInfo(res.msg);
		 cb();
	 });
	 //获取地址
	var cityplace=[];
	 yyajax("index/index/area",{},function(res){
		var place=res.msg;
		app.setalladdress(place);
		for(var i=0;i<place.length;i++){
			if(place[i].pid=="0"){
				cityplace.push({
					value:place[i].id,
					text:place[i].name,
					children:getchild(place,place[i].id)
				})
			}
		}
	 	app.setPlace(cityplace);
	 });
	 var schoolplace=[];
	 yyajax("index/index/teacheracademy",{},function(res){//获取学校
	 	var school=res.msg;
		app.setorschool(school);
	 	for(var i=0;i<school.length;i++){
	 		if(school[i].pid=="0"){
	 			schoolplace.push({
	 				value:school[i].id,
	 				text:school[i].name,
	 				children:getchild(school,school[i].id)
	 			})
	 		}
	 	}
	 	app.setSchool(schoolplace);
	 });
 }
 function cityData(){
	 return app.getPlace();
 }
 function school(){
 	return app.getSchool();
 }
 function assignobj(obj1,obj2){
		for(var key in obj2){
			if(obj2.hasOwnProperty(key)===true){
				obj1[key]=obj2[key];
			}
		}
 }
 var uploadimgurl=myurl+'index/Ajax/upload';
 function uploadhead(idelem,cb,errcb){//file dom元素,成功回调，错误回调
 	var oFile = document.getElementById(idelem).files[0];    //读取文件
 	var formdata=new FormData();
 	//formdata.append('name', 'uploadImage');
 	formdata.append('file',oFile);
 	$.ajax({
 		url:uploadimgurl,
 		type:'post',
 		contentType:false,
 		data:formdata,
 		processData:false,
 		success:function(info){
			if(info.code==1){
				var url=info.data.url;
				cb(url);
			}else{
				mui.toast(info.msg);
				errcb();
			}
 		},
 		error:function(err){
 			errcb(err)
 		}
 	});
 }
 function searchinit(elem,cb){
	 document.getElementById(elem).addEventListener("keypress",function(event) {
	 	var keyword=document.getElementById(elem).value;
	 	if(event.keyCode == "13") {
	 		document.activeElement.blur();//收起虚拟键盘
	 		event.preventDefault(); // 阻止默认事件---阻止页面刷新
			cb(keyword);
	 	}
	 });
 }
function parseTime(val){
	var date = new Date(val * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	var D = date.getDate() + ' ';
	var h = date.getHours() + ':';
	var m = date.getMinutes() + ':';
	var s = date.getSeconds();
	return Y+M+D+h+m+s;
}
function pubinvite(formdata,cb){//邀请
	yyajax('index/index/invite',formdata,function(res){
		if(res.code==200){
			mui.toast(res.msg);
			//$(".addinvite").addClass("");
			cb(res.msg);
		}else{
			mui.hideLoading();
			mui.toast(res.msg);
		}
	})
}
function pubcol(formdata,cb){
	yyajax('index/index/collection',formdata,function(res){
		if(res.code==200){
			mui.toast(res.msg);
			cb(res.msg);
		}else{
			mui.hideLoading();
			mui.toast(res.msg);
		}
	});
}
(function($, owner) {
	/**
	 * 用户登录
	 **/
	 
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.account.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		if (!isPone(loginInfo.account)){
			return callback('请输入有效的手机号码');
		}
		return callback();
		/* var users = JSON.parse(localStorage.getItem('$users') || '[]');
		var authed = users.some(function(user) {
			return loginInfo.account == user.account && loginInfo.password == user.password;
		});//判断
		if (authed) {
			return owner.createState(loginInfo.account, callback);
		} else {
			return callback('用户名或密码错误');
		} */
	};
	owner.login1 = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.account.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if (loginInfo.password.length < 6) {
			return callback('请输入6位验证码');
		}
		if (!isPone(loginInfo.account)){
			return callback('请输入有效的手机号码');
		}
		return callback();
	};
	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if (regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!isPone(regInfo.account)){
			return callback('请输入有效的手机号码');
		}
		/* var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));//注册 */
		return callback();
	};
	owner.getalladdress = function() {
		var stateText = localStorage.getItem('$alladdress') || "{}";
		return JSON.parse(stateText);
	};
	owner.setalladdress = function(state) {
		var state = state || {};
		localStorage.setItem('$alladdress', JSON.stringify(state));
	};
	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		var state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
	};
	/* 获取信息 */
	owner.getInfo = function() {//网站信息
		var stateText = localStorage.getItem('$info') || "{}";
		return JSON.parse(stateText);
	};
	/**
	 * 设置信息
	 **/
	owner.setInfo = function(state) {
		var state = state || {};
		localStorage.setItem('$info', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};
	/* 获取地址 */
	owner.getPlace = function() {
		var stateText = localStorage.getItem('$place') || "{}";
		return JSON.parse(stateText);
	};
	/**
	* 设置地址
	**/
	owner.setPlace = function(state) {
		var state = state || {};
		localStorage.setItem('$place', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};
	/* 获取院校 */
	owner.getSchool = function() {
		var stateText = localStorage.getItem('$school') || "{}";
		return JSON.parse(stateText);
	};
	/**
	* 设置院校
	**/
	owner.setSchool = function(state) {
		var state = state || {};
		localStorage.setItem('$school', JSON.stringify(state));
	};
	/**
	* 设置原始数据院校
	**/
	owner.setorschool = function(state) {
		var state = state || {};
		localStorage.setItem('$setorschool', JSON.stringify(state));
	};
	/* 获取原始数据院校 */
	owner.getorschool = function(state) {
		var stateText = localStorage.getItem('$setorschool') || "{}";
		return JSON.parse(stateText);
	};

	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(forgetInfo, callback) {
		callback = callback || $.noop;
		forgetInfo = forgetInfo || {};
		forgetInfo.account = forgetInfo.account || '';
		forgetInfo.password = forgetInfo.password || '';
		if (forgetInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if (forgetInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!isPone(forgetInfo.account)){
			return callback('请输入有效的手机号码');
		}
		return callback();
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {//获取用户信息
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {//用户信息
			var settingsText = localStorage.getItem('$state') || "{}";
			return JSON.parse(settingsText);
		}
		/**
		 * 获取本地是否安装客户端
		 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch (e) {}
		} else {
			switch (id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));

//designWidth:设计稿的实际宽度值，需要根据实际设置
//maxWidth:制作稿的最大宽度值，需要根据实际设置
//这段js的最后面有两个参数记得要设置，一个为设计稿实际宽度，一个为制作稿最大宽度，例如设计稿为750，最大宽度为750，则为(750,750)
;(function(designWidth, maxWidth) {
    var doc = document,
    win = window,
    docEl = doc.documentElement,
    remStyle = document.createElement("style"),
    tid;

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        maxWidth = maxWidth || 540;
        width>maxWidth && (width=maxWidth);
        var rem = width * 100 / designWidth;
        remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
    }

    if (docEl.firstElementChild) {
        docEl.firstElementChild.appendChild(remStyle);
    } else {
        var wrap = doc.createElement("div");
        wrap.appendChild(remStyle);
        doc.write(wrap.innerHTML);
        wrap = null;
    }
    //要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
    refreshRem();

    win.addEventListener("resize", function() {
        clearTimeout(tid); //防止执行两次
        tid = setTimeout(refreshRem, 300);
    }, false);

    win.addEventListener("pageshow", function(e) {
        if (e.persisted) { // 浏览器后退的时候重新计算
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === "complete") {
        doc.body.style.fontSize = "16px";
    } else {
        doc.addEventListener("DOMContentLoaded", function(e) {
            doc.body.style.fontSize = "16px";
        }, false);
    }
})(750, 750);

/* globle.js */
/* mui.plusReady(function() {
	var height=document.documentElement.clientHeight||document.body.clientHeight;
        plus.webview.currentWebview().setStyle({
               height:height
         });
        window.onresize=function() {
                plus.webview.currentWebview().setStyle({          
				 height:height
                 });
        }
}); */
var pub={
	page:function(url,id){
		return{
			url: url,
			id: id,
			preload: true,
			show: {
				aniShow: 'pop-in'
			},
			styles: {
				popGesture: 'hide'
			},
			waiting: {
				autoShow: true
			}
		}
	}
};
//扩展mui.showLoading
(function($, window) {
    //显示加载框
    $.showLoading = function(message,type) {
        if ($.os.plus && type !== 'div') {
            $.plusReady(function() {
                plus.nativeUI.showWaiting(message);
            });
        } else {
            var html = '';
            html += '<i class="mui-spinner mui-spinner-white"></i>';
            html += '<p class="text">' + (message || "数据加载中") + '</p>';

            //遮罩层
            var mask=document.getElementsByClassName("mui-show-loading-mask");
            if(mask.length==0){
                mask = document.createElement('div');
                mask.classList.add("mui-show-loading-mask");
                document.body.appendChild(mask);
                mask.addEventListener("touchmove", function(e){e.stopPropagation();e.preventDefault();});
            }else{
                mask[0].classList.remove("mui-show-loading-mask-hidden");
            }
            //加载框
            var toast=document.getElementsByClassName("mui-show-loading");
            if(toast.length==0){
                toast = document.createElement('div');
                toast.classList.add("mui-show-loading");
                toast.classList.add('loading-visible');
                document.body.appendChild(toast);
                toast.innerHTML = html;
                toast.addEventListener("touchmove", function(e){e.stopPropagation();e.preventDefault();});
            }else{
                toast[0].innerHTML = html;
                toast[0].classList.add("loading-visible");
            }
        }   
    };

    //隐藏加载框
      $.hideLoading = function(callback) {
        if ($.os.plus) {
            $.plusReady(function() {
                plus.nativeUI.closeWaiting();
            });
        } 
        var mask=document.getElementsByClassName("mui-show-loading-mask");
        var toast=document.getElementsByClassName("mui-show-loading");
        if(mask.length>0){
            mask[0].classList.add("mui-show-loading-mask-hidden");
        }
        if(toast.length>0){
            toast[0].classList.remove("loading-visible");
            callback && callback();
        }
      }
})(mui, window);

function touClass(){
// 公有方法
	this.touch = function(fn1,fn2){
		this.addEventListener('touchstart',function(event){
			var touch = event.targetTouches[0];
			// 开始坐标
			this.startx = touch.pageX;
			this.starty = touch.pageY;
		})
		this.addEventListener('touchmove',function(event){
				var touch = event.targetTouches[0];
				// 结束坐标
				this.endx = touch.pageX;
				this.endy = touch.pageY;
				var x = this.endx - this.startx;
				var y = this.endy - this.starty;
				var w = x<0?x-1:x; //x轴的滑动值, w为x的绝对值
				var h = y<0?y-1:y; //y轴的滑动值
		})
		this.addEventListener('touchend',function(event){
			if((this.startx - this.endx)>=100 && fn1){
				// 执行左滑回调
				fn1();
			}
			if((this.endx - this.startx)>=100 && fn2){
				// 执行右滑回调
				fn2();
			}
		})
	}
}
//右滑返回
/* touClass.call(document);
document.touch('',function(){
	mui.back();
}); */

/* 判断是否为手机号 */
function isPone(pone) {
	var reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
	if (!reg.test(pone)) {
		return false;
	} else {
		return true;
	}
}