const getCollection = (collection) =>{
	wx.showLoading();
	const db = wx.cloud.database();
	return db.collection(collection).get();
}
const getTempFileURL = (id)=>{
	return wx.cloud.getTempFileURL({
		fileList: [id]
	})
}
module.exports = {
	getCollection:getCollection,
	getTempFileURL:getTempFileURL
}