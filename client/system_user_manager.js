$(function(){
	var system_user_manager = {
		init:function(){
			this.settHaF();
			this.getSystemUsers();
		},
		settHaF:function(){
			setHaF();
		},
		getSystemUsers:function(){
			// var option = {
			// 	type: "get",
			// 	contentType: "application/json",
			// 	memo: "获取教师列表",
			// 	url: "/accounts/teachers?activateStatus=SUCCESS",
			// 	// url: "/accounts/teachers?activateStatus=AUTHSTR",
			// 	callback: function(data, status, res){
					var dataTableTemp = $("#dataTableTemp").html();
					laytpl(dataTableTemp).render("data", function(html) {
						$("#dataTableView").html(html);
						$(".dataTables-example").dataTable();
					});
			// 	}
			// };
			// tools.ajaxRequest(option);
		},
	};
	system_user_manager.init();
});