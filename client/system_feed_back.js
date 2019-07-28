$(function(){
	var system_feed_back = {
		init:function(){
			this.settHaF();
			this.getFeedBack();
			this.searchFeedBack();
			this.deleteFeedBack();
		},
		settHaF:function(){
			setHaF();
		},
		getFeedBack:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取意见反馈",
				url: "/config/feedback",
				callback: function(data, status, res){
					var dataTableTemp = $("#dataTableTemp").html();
					laytpl(dataTableTemp).render(data, function(html) {
						$("#dataTableView").html(html);
						$(".dataTables-example").dataTable({
							"columnDefs":[{"orderable": false, "targets": 0}],
							"order": [[2,"asc"]],
							"stateSave": true
						});
					});
				}
			};
			tools.ajaxRequest(option);
		},
		searchFeedBack:function(){
			$("#search").click(function(){
				var connect = $("#connect").val();
				var suggestion =$("#suggestion").val();
				var option = {
					type: "get",
					contentType: "application/json",
					memo: "搜索意见反馈",
					url: "/config/feedback?connect=" + connect + "&suggestion=" + suggestion,
					callback: function(data, status, res){
						var dataTableTemp = $("#dataTableTemp").html();
						laytpl(dataTableTemp).render(data, function(html) {
							$("#dataTableView").html(html);
						});
					}
				};
				tools.ajaxRequest(option);
			});
		},
		deleteFeedBack:function(){
			$("#dataTableView").on('click','tr a.delete',function(){
				if(confirm("确定要删除该反馈吗？")){
					var feedback_id = $(this).attr('data-value');
					var option = {
						type: "post",
						contentType: "application/json",
						memo: "删除意见反馈",
						url: "/config/feedback/" + feedback_id + "/delete",
						callback: function(data, status, res){
							layer.msg(option.memo + '成功', {icon: 6 , time: 1000},function(){
								window.location.reload();
							});
						}
					};
					tools.ajaxRequest(option);
				}
			});
		}
	};
	system_feed_back.init();
});