/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
 var myurl="http://admin.woaiyiyun.com/";
 function yyajax(url,data,callback){
	 mui.ajax(myurl+url,{
		data:data,
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			callback(data);
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			//mui.toast("cuowu");
		}
	});
 }
 function sendcode(phone,type,cb){
	 yyajax('index/user/sms',{phone:phone,type:type},function(res){
		 cb(res);
	 })
 }
 function getinfo(){
	 var userinfo=app.getState();
	 yyajax("index/user/siteinfo",{id:userinfo.id,role:userinfo.role,token:userinfo.token},function(res){
		 app.setInfo(res.msg);
	 })
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
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};
	owner.getInfo = function() {
			var stateText = localStorage.getItem('$info') || "{}";
			return JSON.parse(stateText);
		};
	
		/**
		 * 设置当前状态
		 **/
		owner.setInfo = function(state) {
			var state = state || {};
			localStorage.setItem('$info', JSON.stringify(state));
			//var settings = owner.getSettings();
			//settings.gestures = '';
			//owner.setSettings(settings);
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
		if (!isPone(loginInfo.account)){
			return callback('请输入有效的手机号码');
		}
		return callback();
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
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