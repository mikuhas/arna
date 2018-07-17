(function(){
    'use strict';
    
    /// constant //////////////////////////////////////////
    const WATSON_API_KEY = 'e70f067e54fab5833566d81562a7ee4bb656f850';
    const WATSON_API_VERSION = '2016-05-20';
    const URL_ANALYZE_PICTURE = 'https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key=' + WATSON_API_KEY + '&version=' + WATSON_API_VERSION;
      const PICTURE_MAX_HEIGHT = 400;
      const PICTURE_MAX_WIDTH = 400;

	  const SCORE_THRESHOLD = 0.7;
      
      const KEY_SPLITTER = '>>'; //追加 樋口
	  /// variable ////////////////////////////////////////////
	  var item = null;

	  /// Item Class //////////////////////////////////////////////////////////////////////////////////
  	class Item {
		/// constructor ////////////////////////////////////////
		constructor() {
			this.name = '';
			this.room = '';
			this.funiture = '';
			this.image = null;
		}

		/// function ////////////////////////////////////////////
		/// accessor ///
		setName(n) {
			this.name = n;
		}
		setRoom(r) {
			this.room = r;
		}
		setFuniture(f) {
			this.funiture = f;
		}
		setImage(img) {
			this.image = img;
		}
        /// other function ///   //追加 樋口
        generateKey() {
			return this.room + KEY_SPLITTER + this.funiture + KEY_SPLITTER + this.name;
		}
        /*** 2018/4/7 sugawara add ↓ ***/
        /// JSONに変換 ///
        toJsonString() {
            return JSON.stringify({
                "name" : this.name,
                "room" : this.room,
                "funiture" : this.funiture,
                "image" : this.image
            })
        }
        /*** 2018/4/7 sugawara add ↑ ***/
	}

	/// event //////////////////////////////////////////////////////////////////////////////////////
console.log("Hello camera.js");
function shoot(){
  console.log("shoot")
    var option = {
        saveToPhotoAlbum: true //撮影後端末に保存
    };
    
    //カメラを起動
    navigator.camera.getPicture(onSuccess, onError, option);
        
    //成功時に呼び出されるコールバック関数
    function onSuccess(imageURI){
        document.querySelector("#photo").src = imageURI;
    }
        
    //失敗時に呼び出されるコールバック関数
    function onError(message){
        alert("Error:" + message);
    }
}
})();