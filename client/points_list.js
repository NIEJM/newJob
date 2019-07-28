$(function(){
	var points_list = {
		init:function(){
			this.settHaF();
			this.getPoints();
		},
		settHaF:function(){
			setHaF();
		},
		getPoints:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取优惠券列表",
				url: "/points/batchs",
				callback: function(data, status, res){
					// console.log(data);
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
	};
	points_list.init();
});