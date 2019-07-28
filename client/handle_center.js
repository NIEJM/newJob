$(function(){
	var handle_center = {
		init:function(){
			this.settHaF();
			this.getHandlesData();
			this.searchHandles();
		},
		settHaF:function(){
			setHaF();
		},
		getHandlesData:function(){
			var $this = this;
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取待处理信息列表",
				url: "/callcenter",
				callback: function(data, status, res){
					var dataTableTemp = $("#dataTableTemp").html();
					laytpl(dataTableTemp).render(data, function(html) {
						$("#dataTableView").html(html);
						$(".dataTables-example").dataTable({
							"columnDefs":[{"orderable": false, "targets": 0}],
							"order":[[4,"desc"]],
							"stateSave": true
						});
					});
					layer.close(index);
					$this.reloadPage();
				}
			};
			var index = layer.msg('数据玩命加载中，请稍候……',{time:0});
			tools.ajaxRequest(option);
		},
		searchHandles:function(){
			$("#search").click(function(){
				
			});
		},
		reloadPage:function(){
			setTimeout(function(){window.location.reload()},300000);
		}
	};
	handle_center.init();
});