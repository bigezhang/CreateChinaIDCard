<template>
	<div class="create-china-id-card">
		<div class="container">
			<el-form label-position="top">
				<el-form-item label="出生日期">
					<el-select v-model="field.year" placeholder="选择年份" style="width: 120px;" filterable>
						<el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-select v-model="field.month" placeholder="选择月份" style="width: 120px;" filterable>
						<el-option v-for="item in months" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-select v-model="field.day" placeholder="选择日" style="width:120px;" filterable>
						<el-option v-for="item in days" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="身份证归属地">
					<el-select v-model="field.province" placeholder='请选择' style="width: 160px" :disabled="step < 1" filterable>
						<el-option v-for="item in provinces" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-select v-model="field.city" placeholder='请选择' style="width: 160px" :disabled="step < 2" filterable>
						<el-option v-for="item in citys" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-select v-model="field.area" placeholder='请选择' style="width: 160px" :disabled="step < 3" filterable>
						<el-option v-for="item in areas" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择性别">
					<el-radio v-model="field.sex" :label="item" v-for="(item,i) in sexs" :value="item" :key="i"></el-radio>
				</el-form-item>
				<el-form-item label="安全模式">
					<el-switch v-model="safe" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
					<span style="margin-left: 15px">
						<el-button type="text" @click="showSafeMode = true">什么是安全模式?</el-button>
					</span>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onCreate">生成身份证号码</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-dialog title="什么是安全模式" :visible.sync="showSafeMode" width="480px">
			<p>当你开启了安全模式后, 我们会按照更加严谨的事实情况来生成身份证号码, 譬如第一代身份证最早诞生于1984年4月6号启用的, 长度为15位, 2004年3月29号第二代居民身份证开始发放, 即安全模式下, 无法创建小于第一代身份证启用时间的身份证号码, 同时身份证算法和位数将严格按照年代来生成</p>
			<p>如果不开启安全模式, 那么你将可以任意组合年月日, 我们允许您从1000年~至今, 且全部统一为第二代身份证的18位号码!</p>
			<template slot="footer">
				<el-button type="primary" @click="showSafeMode = false">我知道了</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script>
	import pca from "~/db/pca";
	import mock from "mockjs";
	import validator from 'validator';
	import moment from "moment";

	const {
		Random
	} = mock;

	export default {
		metaInfo: {
			title: "身份证号码在线生成"
		},
		data: function() {
			return {
				safe: true,
				showSafeMode: false,
				field: {},
				years: [],
				months: [],
				days: [],
				provinces: [],
				citys: [],
				areas: [],
				sexs: ["男", "女"],
				step: 0
			}
		},
		computed: {
			fieldYear: function() {
				const _this = this;

				return _this.field.year;
			},
			fieldMonth: function() {
				const _this = this;

				return _this.field.month;
			},
			fieldProvince: function() {
				const _this = this;

				return _this.field.province;
			},
			fieldCity: function() {
				const _this = this;

				return _this.field.city;
			}
		},
		watch: {
			safe: function(open) {
				const _this = this;

				if(open) {
					_this.$message.success("您开启了安全模式");
					_this.initSafe();
				} else {
					_this.$message.error("您关闭了安全模式");
					_this.initNoSafe()
				}
			},
			fieldYear: function(year) {
				const _this = this

				if(year) {
					_this.initMonths().then(function() {
						if(_this.safe) {
							if(_this.field.year == '1984') {
								_this.field.month = '04';
							} else {
								_this.field.month = '01';
							}
						}
					})
				}
			},
			fieldMonth: function(month) {
				const _this = this;

				if(month) {
					let year = _this.field.year;
					let isRunNian = ((year % 4 == 0 && year % 400 == 0) || year % 100 != 0) ? true : false;
					let days = [];

					if(isRunNian) {
						days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
					} else {
						days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
					}
					_this.initDays(days[month - 1]).then(function() {
						if(_this.safe) {
							if(_this.field.year == '1984' && _this.field.month == '04') {
								_this.field.day = "06";
							} else {
								_this.field.day = "01";
							}
						}
					})
				}
			},
			fieldProvince: function(province) {
				const _this = this;

				let citys = pca[province];

				if(citys) {
					let data = [];
					Object.keys(citys).forEach(function(id) {
						data.push({
							label: citys[id],
							value: id.toString()
						})
					})

					_this.step = 2;
					_this.field.city = '';
					_this.field.area = '';
					_this.citys = data;
					_this.areas = [];
				}
			},
			fieldCity: function(city) {
				const _this = this;

				let areas = pca[city];

				if(areas) {
					let data = [];
					Object.keys(areas).forEach(function(id) {
						data.push({
							label: areas[id],
							value: id.toString()
						})
					})

					_this.step = 3;
					_this.field.area = '';
					_this.areas = data;
				}
			}
		},
		created: function() {
			const _this = this;

			_this.initSafe();

		},
		methods: {
			onCreate: function() {
				const _this = this;

				let field = Object.assign({}, _this.field);

				if(validator.isEmpty(field.year)) {
					_this.$message.warning("请选择年份");
					return;
				}

				if(validator.isEmpty(field.month)) {
					_this.$message.warning("请选择月份");
					return;
				}

				if(validator.isEmpty(field.day)) {
					_this.$message.warning("请选择具体日期");
					return;
				}

				if(validator.isEmpty(field.province)) {
					_this.$message.warning("您必须要选择省");
					return;
				}

				if(_this.safe) {
					let minTime = new Date('1984-04-06 00:00:00').getTime();
					let maxTime = new Date('2004-03-29 00:00:00').getTime();
					let nowTime = Date.now();
					let time = new Date([field.year, field.month, field.day].join("-")).getTime();

					if(time < minTime || time > nowTime) {
						_this.$message.error("不合法的出生日期");
					} else {
						if(time >= minTime && time <= maxTime) {
							let id = _this.card1st();
							let name = Random.cname();
							_this.$notify({
								title: '第一代身份证号码',
								dangerouslyUseHTMLString: true,
								message: `<p><b>姓名: </b>${name}</p><p><b>身份证号: </b>${id}</p>`,
								duration: 1000 * 10,
								type: 'success'
							});
						}

						if(time > maxTime && time < nowTime) {
							let id = _this.card2st();
							let name = Random.cname();
							_this.$notify({
								title: '第二代身份证号码',
								dangerouslyUseHTMLString: true,
								message: `<p><b>姓名: </b>${name}</p><p><b>身份证号: </b>${id}</p>`,
								duration: 1000 * 10,
								type: 'success'
							});
						}
					}
				} else {
					let id = _this.card2st();
					let name = Random.cname();
					_this.$notify({
						title: '第二代身份证号码',
						dangerouslyUseHTMLString: true,
						message: `<p><b>姓名: </b>${name}</p><p><b>身份证号: </b>${id}</p>`,
						duration: 1000 * 10,
						type: 'success'
					});
				}
			},
			onDropdownItem: function(cmd) {
				const _this = this;

				switch(cmd) {
					default: _this.$message.warning("开发中..");
					break;
				}
			},
			card1st: function() {
				const _this = this;
				let field = Object.assign({}, _this.field);

				let code;
				if(field.area) {
					code = field.area;
				} else if(field.city) {
					code = field.city;
				} else if(field.province) {
					code = field.province;
				}

				let year = field.year.substring(2);
				let month = field.month;
				let day = field.day;
				let random = Math.floor(Math.random() * 899 + 100);
				let id = `${code}${year}${month}${day}${random}`;

				return id;
			},
			card2st: function() {
				const _this = this;
				let field = Object.assign({}, _this.field);

				let code;
				if(field.area) {
					code = field.area;
				} else if(field.city) {
					code = field.city;
				} else if(field.province) {
					code = field.province;
				}

				// 前17位
				let year = field.year;
				let month = field.month;
				let day = field.day;
				let random = Math.floor(Math.random() * 899 + 100);
				let id = `${code}${year}${month}${day}${random}`;

				// 最后一位
				let mi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
				let mo = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
				let sum = 0;
				for(let i = 0; i < id.length; i++) {
					sum += parseInt(id.charAt(i)) * mi[i];
				}
				let moIndex = sum % 11;
				let last = mo[moIndex];

				return `${id}${last}`;
			},
			initSafe: function() {
				const _this = this;

				let tasks = [];
				tasks.push(_this.initYears());
				tasks.push(_this.initProvinces());

				Promise.all(tasks).then(function() {
					_this.field = {
						year: '',
						month: '',
						day: '',
						province: '',
						city: '',
						area: '',
						sex: '男'
					}

					_this.safe = true;
				});
			},
			initNoSafe: function() {
				const _this = this;

				let tasks = [];
				tasks.push(_this.initYears(1000));
				tasks.push(_this.initProvinces());

				Promise.all(tasks).then(function() {
					_this.field = {
						year: '',
						month: '',
						day: '',
						province: '',
						city: '',
						area: '',
						sex: '男'
					}

					_this.safe = false;
				});
			},
			initProvinces: function() {
				const _this = this;

				return new Promise(function(resolve, reject) {
					try {
						let provinces = Object.assign({}, pca["86"]);

						let data = [];
						Object.keys(provinces).forEach(function(id) {
							data.push({
								label: provinces[id],
								value: id.toString()
							})
						})

						_this.step = 1;
						_this.provinces = data;

						resolve(data);
					} catch(e) {
						reject(e);
					}
				})
			},
			initYears: function(min = 1984, max = new Date().getFullYear()) {
				const _this = this;

				return new Promise(function(resolve, reject) {
					try {
						let start = min;
						let end = max;

						let data = [];
						for(let i = start; i < end; i++) {
							data.push({
								label: `${i}年`,
								value: i.toString()
							})
						}
						_this.years = data;

						resolve(data);
					} catch(e) {
						reject(e);
					}
				})
			},
			initMonths: function(min = 1, max = 12) {
				const _this = this;

				return new Promise(function(resolve, reject) {
					try {
						let start, end;
						start = min;
						end = max;

						if(_this.safe) {
							if(_this.field.year == 1984) {
								start = 4;
							}
						}

						let data = [];
						for(let i = start; i <= end; i++) {
							data.push({
								label: `${i}月`,
								value: i < 10 ? '0' + i : i.toString()
							})
						}
						_this.months = data;

						resolve(data);
					} catch(e) {
						reject(e);
					}
				})
			},
			initDays: function(max = 31) {
				const _this = this;

				return new Promise(function(resolve, reject) {
					try {
						let start, end;
						start = 1;
						end = max;

						if(_this.safe) {
							if(_this.field.year == 1984 && _this.field.month == 4) {
								start = 6;
							}
						}

						let data = [];
						for(let i = start; i <= end; i++) {
							data.push({
								label: `${i}日`,
								value: i < 10 ? '0' + i : i.toString()
							})
						}
						_this.days = data;

						resolve(data);
					} catch(e) {
						reject(e);
					}
				})
			},
		}
	}
</script>

<style lang="less" scoped="scoped">
	.create-china-id-card {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #555;
		>.container {
			cursor: pointer;
			padding: 30px;
			width: 600px;
			height: auto;
			background-color: #fff;
			border-radius: 10px;
			box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
		}
		p+p {
			margin-top: 1em;
		}
	}
</style>