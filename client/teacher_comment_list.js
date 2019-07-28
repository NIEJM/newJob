$(function(){
	var teacher_id = tools.getQueryString('id');
	var teacher_comment_list = {
		init:function(){
			this.settHaF();
			this.getComments();
			this.deleteComment();
			this.searchComments();
		},
		settHaF:function(){
			setHaF();
		},
		getComments:function(){
			var option = {
				type:"get",
				contentType: "application/json",
				url: "/comments/" + teacher_id + "?page=0&size=1000",
				memo: "获取评论列表",
				callback: function(data, status, res){
					var dataTableTemp = $("#dataTableTemp").html();
					laytpl(dataTableTemp).render(data, function(html) {
						$("#dataTableView").html(html);
						$(".dataTables-example").dataTable({
							"order": [[3,"desc"]],
							"stateSave": true
						});
					});
					layer.close(index);
				}
			};
			var index = layer.msg('数据玩命加载中，请稍候……',{time:0});
			tools.ajaxRequest(option);
		},
		deleteComment:function(){
			$("#dataTableView").on('click','tr a.delete',function(){
				if(confirm("确定要删除该评论吗？")){
					var comment_id = $(this).attr('data-value');
					var option = {
						type:"delete",
						contentType:"application/json",
						url:"/comments/"+comment_id,
						memo:"删除评论",
						callback:function(data, status, res){
							console.log(data);
							layer.msg(option.memo + '成功',{icon:6},function(){
								window.location.reload();
							});
						}
					};
					tools.ajaxRequest(option);
				}
			})
		},
		searchComments:function(){
			$("#search").click(function(){
				alert("搜索评论");
			});
		}
	};
	teacher_comment_list.init();
});