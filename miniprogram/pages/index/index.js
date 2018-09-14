//index.js
const app = getApp()
const util = require('../../util/util.js');
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
		
		
		
		goodList:[]
  },

  onLoad: function() {
		
		wx.cloud.init({
			env: 'jin-53ac36'
		})
		this.getAllGoods()
// 		wx.cloud.callFunction({
// 			name:'test',
// 		}).then(res=>{
// 			console.log(res)
// 		})
  },
	getAllGoods:function(){

		wx.showLoading()
		const db = wx.cloud.database()
		let that = this;
		db.collection('goods').get().then(res => {
			let _array = res.data;
			let i=0;
			let getTempFileURL = function(){
				util.getTempFileURL(_array[i].imgid).then(res=>{
					let _img = res.fileList[0];
					_array[i].img = _img.tempFileURL;
					i++;
					if(i<_array.length){
						getTempFileURL()
					}else{
						console.log(_array)
						wx.hideLoading()
						that.setData({
							goodList:_array
						})
					}
				})
			}
			getTempFileURL()
			

			
// .then((res)=>{
// 				console.log(res)
// 				wx.hideLoading()
// 				that.setData({
// 					goodList:res
// 				})
// 			})
// 			Promise.all(_array.forEach((ele,i)=>{
// 				util.getTempFileURL(_array[i].imgid).then(res=>{
// 					let _img = res.fileList[0];
// 					_array[i].img = _img.tempFileURL
// 					
// 				})
// 			})).then((res)=>{
// 				console.log(res)
// 				wx.hideLoading()
// 				that.setData({
// 					goodList:res
// 				})
// 			})

		})
	},
	
	
	getTicket:function(event){
		let texts = event.currentTarget.dataset.text;
		wx.showModal({
			title: '点击复制后打开淘宝客户端即可',
			content:texts,
			confirmText:"复制",
			showCancel:false,
			success: function(res) {
				if (res.confirm) {
					wx.setClipboardData({
						data:texts,
						success: function(res) {
							wx.getClipboardData({
								success: function(res) {
									wx.showToast({
										title: '复制成功',
										icon: 'success',
										duration: 2000
									})
								}
							})
						}
					})
										
				}
			}
		})
	},

	
	
	
	
	
	
	
	
	
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
