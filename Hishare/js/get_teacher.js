$(function(){
	var teacher_id = tools.getQueryString('id');
	var get_teacher = {
		init:function(){
			this.getInfo();
		},
		getInfo:function(){
			//获取教师信息
			var $this = this;
			$.ajax({
				type: "get",
				contentType: "application/json",
				url: config.server_url + "/accounts/teachers/" + teacher_id,
				success: function(data, status, res){
					if(res.status === 200){
						console.log(data);
						var teacherInfoTemp = $("#teacherInfoTemp").html();
						laytpl(teacherInfoTemp).render(data, function(html) {
							$("#teacherInfoForm").html(html);
						});
						$this.getComments();
					}
				},
				error: function(err){
					console.log(err);
				}
			});
		},
		getComments:function(){
			//获取评论
			$.ajax({
				type: "get",
				contentType: "application/json",
				url: config.server_url + "/comments/" + teacher_id,
				success: function(data, status, res){
					if(res.status === 200){
						console.log(data);
						var commentsTemp = $("#commentsTemp").html();
						laytpl(commentsTemp).render(data, function(html) {
							$("#commentsForm").html(html);
						});
					}
				},
				error: function(err){
					console.log(err);
				}
			});
		}
	};
	get_teacher.init();
});