$(function(){
	var system_application_setting = {
		init:function(){
			this.getReasonsInfo();
			this.getSettingsInfo();
			this.addRefuseReason();
			this.saveRefuseReason();
			this.delRefuseReason();
			this.saveInfo();
		},
		getReasonsInfo:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取拒绝理由",
				url: "/config/reason",
				callback: function(data, status, res){
					console.log(data);
					layer.msg(option.memo+"成功" , {icon: 6});
					var refuseReasonTemp = $("#refuseReasonTemp").html();
					laytpl(refuseReasonTemp).render(data, function(html) {
						$("#refuseReasonForm").html(html);
					});
				}
			};
			tools.ajaxRequest(option);
		},
		getSettingsInfo:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取应用设置信息",
				url: "/config/settings",
				callback: function(data, status, res){
					layer.msg(option.memo+"成功" , {icon: 6});
					var applicationSettingTemp = $("#applicationSettingTemp").html();
					laytpl(applicationSettingTemp).render(data, function(html) {
						$("#applicationSettingForm").html(html);
					});
				}
			};
			tools.ajaxRequest(option);
		},
		addRefuseReason:function(){
			$("#refuseReasonForm").on('click','button.addrefuseReason',function(){
				var li = document.createElement('li');
				li.innerHTML = 
				'<div class="input-group"> \
					<input type="hidden" class="id" value="" /> \
					<input type="text" class="form-control refuseReason" value="" /> \
					<span class="input-group-btn"> \
						<button type="button" class="btn btn-warning btn-sm savereason">保存</button> \
						<button type="button" class="btn btn-danger btn-sm delete">删除</button> \
					</span> \
				</div><br>';
				document.getElementById('ol-refuseReason').appendChild(li);
			});
		},
		saveRefuseReason:function(){
			$('#refuseReasonForm').on('click','button.savereason',function(){
				var id = $(this).parent().parent().find('input.id').val();
				var reason = $(this).parent().parent().find('input.refuseReason').val();
				var buttonSave = $(this);
				var formData = {};
				var method = '';
				formData.id = id;
				formData.reason = reason;
				var option = {
					type: "post",
					contentType: "application/json",
					memo: "添加拒绝理由",
					data: JSON.stringify(formData),
					url: "/config/reason",
					callback: function(data, status, res){
						layer.msg(option.memo+"成功" , {icon: 6});
						buttonSave.parent().parent().find('input.id').val(data.id);
						buttonSave.html("更新");
					}
				};
				tools.ajaxRequest(option);
			});
		},
		delRefuseReason:function(){
			$("#refuseReasonForm").on('click','button.delete',function(){
				var id = $(this).parent().parent().find('input.id').val();
				var li = $(this).parent().parent().parent();
				if(id==''){
					li.remove();
				}else{
					var option = {
						type: "delete",
						contentType: "application/json",
						memo: "删除拒绝理由",
						url: "/config/reason/"+id,
						callback: function(data, status, res){
							layer.msg(option.memo+"成功" , {icon: 6});
							li.remove();
						}
					};
					tools.ajaxRequest(option);
				}
			});
		},
		saveInfo:function(){
			$("#applicationSettingForm").on('click','button#save',function(){
				var formData = []
				formData = $("#applicationSettingForm").serializeObject();
				formData.refuseReason = "";
				var option = {
					type: "post",
					contentType: "application/json",
					data: JSON.stringify(formData),
					memo: "保存应用设置",
					url: "/config/settings",
					callback: function(data, status, res){
						layer.msg(option.memo+"成功" , {icon: 6},function(){
							window.location.href = "system_application_setting.html";
						});
					}
				};
				tools.ajaxRequest(option);
			});
		}
	};
	system_application_setting.init();
});