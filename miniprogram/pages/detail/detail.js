// pages/detail/detail.js
const util = require('../../util/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration:500,
		detailImg:[
			'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
			'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
			'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
		],
		detail:{
			title:"SK-II 护肤精华露",
			hot:"1888",
			price:"888",
			content:"SK-II始终坚持改写女性肌肤命运的品牌理念，自王牌成分PITERA诞生起，便以其为灵感研发而成了四大王牌产品，深受全球爱用者喜爱，帮助成就肌肤晶莹剔透。"
		}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		wx.cloud.init({
			env: 'jin-53ac36'
		})
		wx.showLoading();
		const db = wx.cloud.database();
		db.collection('seaGoods').where({
			id:options.id
		}).get().then(res=>{
			let detail = res.data[0];
			this.setData({
				detail:detail
			})
		})
		
		db.collection('seaGoodsImg').where({
			id:options.id
		}).get().then(res=>{
			
// 			let detail_img = res.data[0].detail_img.split("+++++++++");
// 			let swiper_img = res.data[0].swiper_img.split("+++++++++");
			let detailImg = res.data[0].detailImg;
			let swiperImg = res.data[0].swiperImg;
			let _detailImg=[];
			let _swiperImg=[];
			let i=0;
			let j=0;
			let that = this;
			
			let getSwiper = function(){
				util.getTempFileURL(swiperImg[i]).then((res)=>{
					let _img = res.fileList[0].tempFileURL;
					_swiperImg.push(_img)
					i++;
					if(i<swiperImg.length){
						getSwiper()
					}else{
						that.setData({
							imgUrls:_swiperImg
						})
					}
				})
			}
			getSwiper();
			
			let getDetail = function(){
				util.getTempFileURL(detailImg[j]).then((res)=>{
					let _img = res.fileList[0].tempFileURL;
					_detailImg.push(_img)
					j++;
					console.log(detailImg)
					if(j<detailImg.length){
						getDetail()
					}else{
						that.setData({
							detailImg:_detailImg
						})
						wx.hideLoading();
					}
				})
			}
			getDetail();
		})
// 		goodApi.seaById(options).then((res)=>{
// 			
// 			let detail = res.data.data[0];
// 			this.setData({
// 				detail:detail
// 			})
// 		})
// 		goodApi.seaImgById(options).then((res2)=>{
// 			let detail_img = res2.data.detail_img;
// 			let swiper_img = res2.data.swiper_img;
// 			this.setData({
// 				imgUrls:swiper_img,
// 				detailImg:detail_img
// 			})
// 		})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})