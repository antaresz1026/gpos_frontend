<template>
	<u-tabbar
		:value="page"
		@change="(name) => PageChangeClick(name)"
		:fixed="true"
		:placeholder="true"
		:safeAreaInsetBottom="true"
	>
		<u-tabbar-item name="home" text="首页" icon="home" @click="(name) => PageChangeClick(name)" ></u-tabbar-item>
		<u-tabbar-item name="mine" text="我的" icon="account" @click="(name) => PageChangeClick(name)" ></u-tabbar-item>
	</u-tabbar>
	<view v-if="login == false && page == 'login'">
		<view class="avatar_display">
			<button class="avatar_wrapper" style="z-index: 1;opacity: 0;" open-type="chooseAvatar" @chooseavatar="ChooseAvatar"></button>
			<image class="avatar_wrapper" :src="avatar_url"></image>	
		</view>
		<view class="nickname_input_box">
			<label class="nickname_label" for="nickname">昵称</label>
			<input 
				class="nickname_input" 
				id="nickname" 
				type="nickname" 
				placeholder="请输入昵称"
				maxlength="16"
				@confirm="NicknameConfirm"
				@nicknamereview="NicknameCheck"
			/>
			<view style="position: absolute;margin-top: 10vh;width: 90vw; margin-left: 5vw;">
				<button 
					type="primary" 
					:disabled="!login_access"
					:hairline="true" 
					open-type="agreePrivacyAuthorization" 
					@click="UserLogin()" 
				>
				登录</button>
			</view>
		</view>

	</view>
	<view v-if="page == 'home'">
		<view class="container">
			<view class="row">
			  <view class="card">
				<text style="font-size: 4vh;color: white;margin-top: 2vh;margin-left: 2vw;">一键合影</text>
				<text style="color: #e7e7e7;margin-top: 1vh;margin-left: 2vw;">快来“云游”四方</text>
				<view style="width:36vw;height:5vh;margin-top: 6vh;margin-left: 2vw;border: 1px solid yellow">
					<u-button shape="circle" text="开始使用" @click="GPOS_start()"></u-button>
				</view>
			  </view>
			  <view class="card">
				  
			  </view>
			</view>
			<view class="row">
				
			</view>
		</view>
	</view>
	<view v-else-if="page == 'mine'">
		<view class="user_info" >
			<view class="avatar">
				<u-avatar size="100" :src="avatar_url"></u-avatar>	
			</view>
			<view class="nickname_display">
				<u--text color="#000000" :text="nickname" :size="30" :bold="true" :lines="1" ></u--text>
				<button style="position: absolute;width: 30vw;height: 4vh;margin-top: 2vh;border-radius: 10px;border: 1px solid red;" v-if="login == false" @click="PageChangeClick('login')"></button>
				<text style="position: absolute;margin-top: 2vh;margin-left: 10vw;font-size: 20px;border: 1px solid red;" v-if="login == false">登录</text>
				<button style="position: absolute;width: 40vw;height: 4vh;margin-top: 2vh;border-radius: 10px;border: 1px solid red;" v-if="login == true"></button>
				<text style="position: absolute;margin-top: 2vh;width: 30vw;margin-left: 6vw;font-size: 20px;border: 1px solid red;" v-if="login == true">编辑个人资料</text>
			</view>
		</view>
		<u-cell-group :customStyle="cellgroups_style">
			<u-cell name="graph" title="我的合影" isLink="true"  @click="(name) => PageChangeClick(name)"></u-cell>
			<u-cell name="settings" title="设置" isLink="true" @click="(name) => PageChangeClick(name)"></u-cell>
		</u-cell-group>
	</view>
</template>

<script>
	const default_avatar_url = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
	export default {
		data() {
			return {
				login_access: true,
				login: false,
				avatar_url: default_avatar_url,
				nickname: "默认用户",
				nicknamepass: false,
				page: "login",
				cellgroups_style: {
					'position': 'relative',
					'width': '100vw',
					'margin-top': '10vh',
					'background-color': '#ffffff'
				}
			} 
		},
		methods: {
			ChooseAvatar(e) {
				this.avatar_url = e.detail.avatarUrl;
			},
			LoginClick() {
				if(nickname != "默认用户" && nickname != "") {
					this.login_access = true;
				}
			},
			NicknameCheck(e) {
				if(e.detail.pass) {
					this.nicknamepass = true;
				} else {
					wx.showToast({
						title: '昵称审核超时',
						icon: 'error'
					})
				}
			},
			NicknameConfirm(e) {
				if(this.nicknamepass) {
					this.nickname = e.detail.value;
					this.login_access = true;
				}
			},
			PageChangeClick(index) {
				this.page = index;
			},
			UserLogin() {
				wx.login({
					success: (res) => {
						if (res.code) {
							wx.request({
								url: 'https://antaresz.cc:21026/GPOS/login',
								method: 'POST',
								data: {
									code: res.code,
									nickname: this.nickname
								},
								success: (res) => {
									this.PageChangeClick("mine");
									this.sessionID = res.data.sessionID;
									console.log(this.sessionID);
								},
								fail (error) {
									wx.showToast({
										title: '服务器未响应',
										icon: 'error'
									})
								}
							})
						} else {
							wx.showToast({
								title: '登录失败！'
							})
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uview-ui/theme.scss';
	
	//Page "mine"
	.user_info {
		position: fixed;
		top: 0vh;
		background-color: #9acafc;
		width: 100vw;
		height: 130px;
		display: flex;
		border: 2px solid red;
	}
	.avatar {
		width: 100px;
		height: 100px;
		margin-top: 15px;
		margin-left: 3vw;
		border-radius: 50%;
		border: 2px solid blue;
	}
	.nickname_display {
		position: relative;
		margin-top: 30px;
		margin-left: 10vw;
	}
	
	//Page "login"
	.avatar_display {
		background-color: #ffffff;
		width: 100vw;
		height: 20vh;
		position: fixed;
		top: 0vh;
		display: flex;
		justify-content: center;
	}
	.avatar_wrapper {
		position: absolute;
		width: 15vh;
		height: 15vh;
		margin-top: 2.5vh;
		border-radius: 50%;
	}
	.nickname_input_box {
		background-color: #ffffff;
		position: fixed;
		top: 24vh;
		width: 100vw;
		height: 5vh;
		display: flex;	
	}
	.nickname_label {
		width: 15vw;
		height: 5vh;
		font-size: 2vh;
		text-align: center;
		line-height: 5vh;
		border: 0.1px solid grey;
		border-radius: 2px;
	}
	.nickname_input {
		width: 85vw;
		height: 5vh;
		line-height: 5vh;
		border: 0.1px solid grey;
	}

	.container {
		width: 100vw;
		height: 81vh;
		border: 2px solid red;
	}
	.row {
		width: 100vw;
		height: 27vh;
		display: flex;
		justify-content: space-around;
		border: 2px solid blue;
	}
	.card {
		width: 41vw; 
		height: 25vh; 
		display: flex;
		flex-direction: column;
		background-color: $u-primary;
		border-radius: 10px; 
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
