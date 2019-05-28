<template>
	<div id="app">
		<router-view>
			<!--
            	作者：1011006133@qq.com
            	时间：2019-05-13
            	描述：
            -->
		</router-view>
	</div>
</template>

<script>
	export default {
		methods: {
			startHacking() {
				this.$notify({
					title: 'It works!',
					type: 'success',
					message: 'We\'ve laid the ground work for you. It\'s time for you to build something epic!',
					duration: 5000
				})
			}
		}
	}
</script>

<style lang="less">
	html,
	body,
	#app {
		height: 100%;
		width: 100%;
		margin: 0px;
		padding: 0px;
	}
	
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}
	
	h1,h2,h3,h4,h5,h6,p {
		margin: 0px;
		padding: 0px;
	}
	
	img {
		vertical-align: top;
	}
	
	a {
		color: #0077AA;
	}
</style>