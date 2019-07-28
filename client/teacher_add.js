$(function(){
	var id = tools.getQueryString('id');
	var sta = tools.getQueryString('sta');
	var countrys = {};
	var getCountrys = {
		init:function(){
			this.getCountry();
		},
		getCountry:function(){
			var option = {
				type: "get",
				sync: false,
				contentType: "application/json",
				memo: "获取国家信息",
				url: "/config/country",
				callback: function(data, status, res){
					countrys = data;
					teacher_add.init();
				}
			};
			tools.ajaxRequest(option);
		}
	};
	var teacher_add = {
		init:function(){
			this.searchMap();
			this.setTitle();
			this.getInfo();
			this.regFormSubmit();
			this.regTeacher();
			this.saveFormSubmit();
			this.saveTeacher();
			this.add_address();
			this.save_address();
			this.delete_address();
			this.backToList();
		},
		searchMap:function(){
			$("#addTeacherForm").on('blur','#address',function(){
				var e = $(this);
				var callback = true;
				geocoder(e,callback);
			});
			$("#addTeacherForm").on('focus','#address',function(){
				$(this).next('i').remove();
			});
			$("#addTeacherForm").on('blur','.classAddress',function(){
				var e = $(this);
				var callback = false;
				geocoder(e,callback);
			});
			$("#addTeacherForm").on('focus','.classAddress',function(){
				$(this).next('i').remove();
			});
		},
		setTitle:function(){
			var subtitleTemp = $("#subtitleTemp").html();
			laytpl(subtitleTemp).render(sta, function(html) {
				$("#subtitle").html(html);
			});
		},
		getInfo:function(){
			var $this = this;
			var addTeacherTemp = $("#addTeacherTemp").html();
			if(sta=='add'){
				$("#regTeacherForm").show();
			}else{
				$("#addTeacherForm").show();
				var option = {
					type: "get",
					contentType: "application/json",
					memo: "获取教师信息",
					url: "/accounts/teachers/" + id,
					callback: function(data, status, res){
						console.log(data);
						layer.msg(option.memo+"成功" , {icon: 6});
						data.countrys = countrys;
						laytpl(addTeacherTemp).render(data, function(html) {
							$("#addTeacherForm").html(html);
							$this.imgUpload();
						});
					}
				};
				tools.ajaxRequest(option);
			}
		},
		regFormSubmit:function(){
			$("#reg").click(function(){
				$("#regTeacherForm").submit();
			});
		},
		regTeacher:function(){
			var $this = this;
			$("#regTeacherForm").validate({
				submitHandler: function (form) {
					var formData = [];
					formData = $('#regTeacherForm').serializeObject();
					var option = {
						type: "post",
						contentType: "application/json",
						data: JSON.stringify(formData),
						memo: "注册教师",
						url: "/accounts/admin/teacher",
						callback: function(data, status, res){
							layer.msg(option.memo+"成功" , {icon: 6});
							window.location.href = "teacher_add.html?sta=edit&id=" + data.id;
						}
					};
					tools.ajaxRequest(option);
				}
			});
		},
		saveFormSubmit:function(){
			$("#addTeacherForm").on('click','button#save',function(){
				$("#addTeacherForm").submit();
			});
		},
		saveTeacher:function(){
			$("#addTeacherForm").validate({
				submitHandler: function (form) {
					var formData = [];
					formData = $('#addTeacherForm').serializeObject();
					formData.speakChinese = $("#speakChinese").prop("checked");
					formData.passportCertification = $("#passportCertification").prop("checked");
					formData.educationCertification = $("#educationCertification").prop("checked");
					formData.orderReceivingStatus = $("#orderReceivingStatus").prop("checked");
					formData.accountStatus = $("#accountStatus").prop("checked");
					formData.togetherStatus = $("#togetherStatus").prop("checked");
					formData.id = id;
					console.log(formData);
					var option = {
						type: "put",
						contentType: "application/json",
						data: JSON.stringify(formData),
						memo: "保存教师",
						url: "/accounts/admin/teacher",
						callback: function(data, status, res){
							layer.msg(option.memo+"成功" , {icon: 6},function(){
								// window.location.href= "teacher_add.html?sta=edit&id=" + id;
							});
						}
					};
					tools.ajaxRequest(option);
				}
			});
		},
		imgUpload:function(){
			tools.fileUpload('#upload_avatarUrl',$('#avatarUrl_box'),$('#avatarUrl'));
			tools.fileUpload('#upload_listUrl',$('#listUrl_box'),$('#listUrl'));
		},
		add_address:function(){
			$('#addTeacherForm').on('click','button.addAddress',function(){
				var li = document.createElement('li');
				li.innerHTML = 
				'<div class="input-group lang">' + 
				'<input type="text" class="form-control classAddress" value="" />' + 
				'<span class="input-group-btn">' + 
				'<button type="button" class="btn btn-warning btn-sm saveAddr">保存</button>' + 
				'<button type="button" class="btn btn-danger btn-sm delete">删除</button>' + 
				'</span></div><br>';
				document.getElementById('ul-classAddress').appendChild(li);
			});
		},
		save_address:function(){
			$('#addTeacherForm').on('click','li button.saveAddr',function(){
				var classAddress = $(this).parent().parent().find('input.classAddress').val();
				var buttonSave = $(this);
				var formData = {};
				formData.classAddress = classAddress;
				var option = {
					type: "post",
					contentType: "application/json",
					memo: "添加授课地址",
					data: JSON.stringify(formData),
					url: "/accounts/teachers/" + id + "/class_address",
					callback: function(data, status, res){
						layer.msg(option.memo+"成功" , {icon: 6});
						buttonSave.parent().remove();
					}
				};
				tools.ajaxRequest(option);
			});
		},
		delete_address:function(){
			var $this = this;
			$('#addTeacherForm').on('click','li button.delete',function(){
				var addrId = $(this).parent().parent().find('input.id').val();
				var buttonDel = $(this);
				var option = {
					type: "delete",
					contentType: "application/json",
					memo: "删除授课地址",
					url: "/accounts/teachers/" + addrId + "/class_address",
					callback: function(data, status, res){
						layer.msg(option.memo+"成功" , {icon: 6});
					}
				};
				if(isNull(addrId)!=""){
					tools.ajaxRequest(option);
				}
				var del = buttonDel.parent();
				var li = del.parent().parent();
				li.remove();
			});
		},
		backToList:function(){
			$("#regTeacherForm").on('click','button#cancel',function(){
				history.go(-1);
			});
			$("#addTeacherForm").on('click','button#cancel',function(){
				history.go(-1);
			});
		}
	};
	getCountrys.init();
});