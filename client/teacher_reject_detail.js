$(function(){
	var teacher_id = tools.getQueryString('id');
	var teacher_reject_detail = {
		init:function(){
			this.getInfo();
			this.backToList();
		},
		getInfo:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取教师信息",
				url: "/accounts/teachers/" + teacher_id,
				callback: function(data, status, res){
					var teacherInfoTemp = $("#teacherInfoTemp").html();
					laytpl(teacherInfoTemp).render(data, function(html) {
						$("#newTeacherForm").html(html);
					});
					layer.close(index);
				}
			};
			var index = layer.msg('数据玩命加载中，请稍候……',{time:0});
			tools.ajaxRequest(option);
		},
		backToList:function(){
			$("#cancel").click(function(){
				history.go(-1);
			});
		}
	};
	teacher_reject_detail.init();
});