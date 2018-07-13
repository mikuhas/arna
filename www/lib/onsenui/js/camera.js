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
	//カメラ起動（画像登録の開始）
  var kagu = "#kagu";
  console.log(kagu)
	$(kagu).on('click', function (){
    console.log("on")
		//カメラを起動
		let camera = navigator.camera;
        const srcType = camera.PictureSourceType.CAMERA;
        //const srcType = camera.PictureSourceType.PHOTOGRAPH;
		let options = setOptions(srcType);
		/// サイズ変更 ///
		options.targetHeight = PICTURE_MAX_HEIGHT;
		options.targetWidth = PICTURE_MAX_WIDTH;
		
		$('#p_result').html('open camera');
		camera.getPicture(onSuccess, onError);
        
        

		//成功時に呼び出されるコールバック関数
		function onSuccess(imageURI){
			// 撮影した画像の表示
			let img = new Image();
            
            //画像の大きさ判定して横が大きかった画像回転
            /*var intervalId = setInterval( function () {
                if ( ImageURI.complete ) {
            		var width = ImageURI.naturalWidth ;
            		var height = ImageURI.naturalHeight ;
            
            		clearInterval( intervalId ) ;
                    console.log(width);
            	}
            }, 500 ) ;*/
			img.src = imageURI;
			img.height = PICTURE_MAX_HEIGHT;
            img.width  = PICTURE_MAX_WIDTH;
			$('#div_image').html('');
			$('#div_image').append(img);

			// itemオブジェクトの生成と画像解析
			item = new Item();
    		$('#p_result').text('analyze picture...');
			getFileEntry(imageURI, analyseImage);
		}
		//失敗時に呼び出されるコールバック関数
		//カメラキャンセル時もここに移る
		function onError(message){
			alert("Error:" + message);
			$('#p_result').html('camera fail');
		}
	});

	/// 登録ボタン押下時 ///
	$('#btn_submit').on('click', function(){
		if (item == null) {
			//window.alert('先に写真撮って');
      //return;
      /// デバッグ用(画像はNULLのまま) ///
      item = new Item();
		}
    
    /*** 2018/4/7 sugawara add ↓ ***/
    /// itemのインスタンスに値をセット ///
    item = setItemParam(item);
        
    /// localStorageに保存 ///
        localStorage.setItem(item.generateKey(), item.toJsonString()); //追加 樋口
		//localStorage.setItem("dummy_key", item.toJsonString());
		window.alert("保存しました");
    /*** 2018/4/7 sugawara add ↑ ***/
    });
    
    ////登録とギャラリーのimgを消す////////
    $(function(){
        $("#imges1").on("click",function(){
            $(".select img").css({
              "display":"none",
            })
        })
    })
    
	/// function ///////////////////////////////////////////////////////////////////////////////////
	// 画像からFileEntryオブジェクトを取得（要：Fileプラグイン）
	function getFileEntry(imgUri, callback) {
		window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {
			callback(fileEntry);
		}, function () {
			// 見つからなければ新規作成（通常、ここに処理が移ることはない）
			createNewFileEntry(imgUri);
		});
	}

	// fileEntryからバイナリファイルを読み込み、画像解析を行う（要：Fileプラグイン）
	function analyseImage(fileEntry) {
		fileEntry.file(function (file) {
      // 画像取得成功時の処理
      let reader = new FileReader();

      reader.onloadend = function() {
        // 画像解析＆結果表示（バイナリ形式）
        /*** 2018/4/27 sugawara change ↓ ***/
        // item.setImage(new Blob([new Uint8Array(this.result)], { type: "image/jpeg" });
        postAjax(URL_ANALYZE_PICTURE, new Blob([new Uint8Array(this.result)], { type: "image/jpeg" }))
        /*** 2018/4/27 sugawara change ↑ ***/
          .done( analyseResult )
          .fail( function(data){console.log(data);} );
      };
      reader.readAsArrayBuffer(file);

        /*** 2018/4/27 sugawara add ↓ ***/
      let dataReader = new FileReader();
      dataReader.onloadend = function() {
        // 画像保存（dataURL形式）
        item.setImage(this.result);
      };
      dataReader.readAsDataURL(file);
        /*** 2018/4/27 sugawara add ↑ ***/

    }, 
    // 画像取得失敗時の処理
    function(msg){ consle.log("Error:" + msg); });
  }
	
	// サーバにデータを投げる
	function postAjax(u, d) {
	   return $.ajax({
			cache: false,
			dataType: 'json',
			method: 'POST',
			url: u,
			data: d,
			processData: false,
			contentType: false
		});
	}
	// 画像解析後の処理 //
	function analyseResult(data){
		let ret = data.images[0].classifiers[0].classes;
		const $div = $('#div_analysed');

		//値表示
		$div.html('');
		for(let i=0; i<ret.length; i++){
			if(ret[i].score >= SCORE_THRESHOLD){
				let chk = '';
				if ($div.html() == '') {
					chk = 'checked="checked"';
				}
				//$div.append('<input type="radio" autocomplete="off" name="item_name" class="reans" value="' + ret[i].class + '" ' + chk + '>' + ret[i].class);
                $div.append('<input type="radio" autocomplete="off" name="item_name" class="reans" id=' + ret[i].class + ' value="' + ret[i].class + '" ' + chk + '>');
                $div.append('<label for=' + ret[i].class + ' class="label">' + ret[i].class + '</label>');
			}
		}

        $('#p_result').text('finished');
	}

	// カメラ起動時のオプション設定
	function setOptions(srcType) {
		let options = {
			// Some common settings are 20, 50, and 100
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI,
			// In this app, dynamically set the picture source, Camera or photo gallery
			sourceType: srcType,
			encodingType: Camera.EncodingType.PNG,
			mediaType: Camera.MediaType.PICTURE,
			allowEdit: true,		//monaca Docsによると「使ってはいけない」と言われているが・・・
			correctOrientation: true  //Corrects Android orientation quirks
		}
		return options;
	}
    
    /*** 2018/4/7 sugawara add ↓ ***/
    // itemオブジェクトにパラメータを設定
    function setItemParam(i) {
    	i.room = $('#sel_room').val();
		i.funiture = $('#sel_funiture').val();
        i.name = $("input[name='item_name']:checked").val();
        
        let key = i.generateKey();//追加 樋口

        return i;
    /*** 2018/4/7 sugawara add ↑ ***/
    }
})();