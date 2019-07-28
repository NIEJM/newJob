$(function(){
	var system_content_manage = {
		init:function(){
			this.getInfo();
		},
		getInfo:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取推送内容",
				url: "/config/manager",
				callback: function(data, status, res){
				}
			};
			tools.ajaxRequest(option);
		}
	};
	system_content_manage.init();
});