$(function(){
	var student_id = tools.getQueryString('id');
	var points_status = {
		init:function(){
			this.settHaF();
			this.getStatus();
		},
		settHaF:function(){
			setHaF();
		},
		getStatus:function(){
			if(isNull(student_id)!=''){
				var url = "/points/" + student_id + "/POINT/INCOME";
			}else{
				var url = "/points/admin/POINT/INCOME";
			}
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取优惠券使用情况",
				url: url,
				callback: function(data, status, res){
					var datas = [];
					if(isNull(student_id)!=''){
						datas.push(data);
					}else{
						datas = data;
					}
					var dataTableTemp = $("#dataTableTemp").html();
					laytpl(dataTableTemp).render(datas, function(html) {
						$("#dataTableView").html(html);
						$(".dataTables-example").dataTable({
							"order": [[4,"desc"]],
							"stateSave": true
						});
					});
				}
			};
			tools.ajaxRequest(option);
		}
	};
	points_status.init();
});