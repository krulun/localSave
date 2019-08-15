//适合pc端关闭网页或者跳转网页，移动端不知是否兼容
/*
*2016 12 26
*autor guangweiguo
*version 1.0.0
*
*----必须
*@wrapper 外层的包裹wrapper需要是唯一的变量名（不可重复）最好是id名     ----必须
* -----一下为非必须
*@expire为储存时间，单位日
*@selectClass 为所有要储存信息元素的class名，   默认wrapper里所有input 
*@deletBtn  为删除存储所有，提交后若果先删除村粗，可以用这个btn 
*@savaData 缓存的数据 
*@isonbeforeunload 是否离开页面储存数据 默认是 
*@isStorage 是否进行存储 默认存储
*@isTypeIn  是否把存储数据写进input框框， 默认写入  慎重写  不录入数据单可以存储数据
*@saveBtn 	为立刻触发本地储存的元素 非必须
*@btnTrigger  为立即触发本地储存元素的事件， 无需on，如mouseover，click，等，如果用户自己定义的事件
*
*----方法
*此方法用于用户直接饮用，饮用方法为 --相触发事件的地方写localSave_trigger(a,b)
*localSave_trigger(a,b)   a为选择器 #id、.class、nodeName  b为事件类型（字符串） 
*推荐使用方法  而不是saveBtn 和 btnTrigger
*/
(function(win){
	function localSave(param){
		this.param = param || {};
		this.data = {};
		this.wrapper =this.param.wrapper;//根据id或者class进行
		this.param.wrapper = this.param.wrapper.substring(1);
		this.expire =  this.param.expire ? this.param.expire :null;
		this.selectClass= this.param.selectClass ? this.param.selectClass :null;
		this.deletBtn = this.param.deletBtn ? this.param.deletBtn : null;
		this.saveBtn = this.param.saveBtn ? this.param.saveBtn :null;
		this.saveData = localStorage.getItem(this.param.wrapper) ? JSON.parse(localStorage.getItem(this.param.wrapper)):null;
		this.isStorage = this.param.hasOwnProperty('isStorage') ? (this.param.isStorage ? true:false) :true;
		this.btnTrigger = this.param.btnTrigger ? this.param.btnTrigger :null;
		this.isTypeIn =  String(this.param.isTypeIn) =='false' ? false:true;
		this.init();
	}
	localSave.prototype = {
		constructor:localSave,
		init :function(){
			var that = this;
			this.data  = JSON.parse(localStorage.getItem(this.param.wrapper));
			if(this.data.local_save_time > Date().now){
				this.isTypeIn ? (this.saveData ? this.writeSave() : '') : "";
			}
			this.deletBtn ? document.querySelector(this.deletBtn).addEventListener('click',function(){
				that.delete();
			}) :'';
			this.isonbeforeunload = String(this.param.isonbeforeunload) == 'fasle' ? false:true;
			this.isonbeforeunload ? 
			window.onbeforeunload = function(){//默认离开页面进行存储
				if(that.isStorage){
					that.toSave();
				}
			} : '';
			//var event = document.createEvent("CustomEvent");//onchange事件要用HTMLEvents
			//event.initEvent(that.btnTrigger,true,true);//三个参数分别对应event的 type 属性、bubbles 属性和 cancelable 属性
			try{
				document.querySelector(this.saveBtn).addEventListener(that.btnTrigger,function(){
					alert('cufale')
					that.toSave();
				},false) ;
			}catch(e){
				console.log(e)
			}
			
			//document.querySelector(this.saveBtn).dispatchEvent(event);//给元素分派事件
			//为用户自定义事件触发的方法
			localSave_trigger = function(ele, event) {
				document.querySelector(ele).addEventListener(event, function() {
					that.toSave();
				}, false);
				if (document.all) {
					document.querySelector(ele).event()
				} else {
					var evtType = event == 'onchange' ? 'HTMLEvenets' : 'Event';
					var evt = document.createEvent(evtType); //onchange需要HTMLEvenets
					evt.initEvent(event, true, true);
					document.querySelector(ele).dispatchEvent(evt);
				}
			}

		},
		writeSave : function(){
			for (var i in this.saveData) {
				var el = document.querySelector(this.wrapper).querySelector('input[name = '+i+']') ||  document.querySelector(this.wrapper).querySelector('select[name = '+i+']')
				if(el.type && (el.type ==='radio')){
					var thisRadio = document.querySelector(this.wrapper).querySelectorAll('input[name = '+i+']');
					for(var j =0;j<thisRadio.length;j++){
						if(thisRadio[j].value == this.saveData[i]){
							thisRadio[j].checked = 'checked';
							break;
						}
					}
				}else{
					el.value = this.saveData[i];
				}
			}
		},
		toSave:function (){
			var data = {};
			var saveList =this.selectClass ?  document.querySelectorAll(this.selectClass) 
			: document.querySelector(this.wrapper).querySelectorAll('input');
			for(var i= 0;i<saveList.length;i++){
				var res = saveList[i].value.replace(/(^\s*)|(\s*$)/g, "");
				if(res.length>0)
				if((typeof saveList[i].type !='underfined') && saveList[i].type == 'radio' ){//若果单选的话
					saveList[i].checked ? (data[saveList[i].name] = res) :'';
				}else{
					data[saveList[i].name] = res;
				}
			}
			data['local_save_time'] = new Date().setDate(new Date().getDate()+this.expire);
			data = JSON.stringify(data);
			localStorage.setItem(this.param.wrapper,data);
// 			if(this.expire){
// 				setTimeout(function(){
// 					localStorage.removeItem(this.param.wrapper);
// 					window.location.href="http://www.video.com"
// 				},this.expire)
// 			}
			return ;
		},
		delete: function(){
			localStorage.removeItem(this.param.wrapper);
			this.isStorage = false;
			
		}
	}
	win.localSave = localSave;
	
})(window)
