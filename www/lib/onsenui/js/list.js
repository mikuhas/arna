(function(){
    'use_strict';
    /// constant ////////////////////////////////////////////////////
    const KEY_SPLITTER = '>>';

    const FNAME_ROOM = '部屋';
    const FNAME_FUNITURE = '家具';
    const FNAME_NAME = '名前';

    /// main ////////////////////////////////////////////////////////
    refreshList();

    /// event ///////////////////////////////////////////////////////
    /// フィルタ条件変更時 ///
    $('#sel_rfilter').on('change', onFilterChanged);
	$('#sel_ffilter').on('change', onFilterChanged);
	$('#txt_ifilter').on('change', onFilterChanged);

    //Enterキーの挙動置換
    $("#txt_ifilter").on('keydown', function(e) {
        if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
            onFilterChanged();
            return false;
        } else {
            return true;
        }
    });
	/// function ////////////////////////////////////////////////////
	// 各フィルタ条件変更時の共通動作 //
	function onFilterChanged() {
		//console.log('changed');
		let rest = {};
		rest[FNAME_ROOM] = $('#sel_rfilter').val();
		rest[FNAME_FUNITURE] = $('#sel_ffilter').val();
		rest[FNAME_NAME] = $('#txt_ifilter').val();
		refreshList(rest);
	}

	// リストの再描画
	// 引数	: rest	: 検索条件。 例：{'部屋' : 'リビング', '家具' : 'タンス']
	function refreshList(rest = null) {
        //const $list = $('#div_list'); //変更　樋口
        const $kensaku = $('.kensaku');
        let items = selectItem(rest);

        $kensaku.html('');
		for( i = 0; i < items.length; i++) {
			item = items[i];
            
            // itemf[i]要素を作成     // 追加　樋口
            var itemf = {}; 
            itemf[i] = document.createElement('figure');
            itemf[i].setAttribute("id", 'itemf[' + i + ']');
            //itemfc[i].innerText = 'itemfc[' + i + ']要素を作成しました';
            // itemf[i]要素をbodyに追加
            $('.kensaku').append(itemf[i]);
            const $listf = $(itemf[i]);

            // itemd[i]要素を作成     // 追加　樋口
            var itemd = {}; 
            itemd[i] = document.createElement('div');
            itemd[i].setAttribute("id", 'itemd[' + i + ']');
            itemd[i].setAttribute("class", 'waku');
            // itemd[i]要素をfigureに追加
            //document.body.appendChild(itemd[i]);
            $(itemf[i]).append(itemd[i]);
            const $listd = $(itemd[i]);
　
            // itemfc[i]要素を作成　
            var itemfc = {}; 
            itemfc[i] = document.createElement('figcaption');
            itemfc[i].setAttribute("id", 'itemfc[' + i + ']');
            //itemfc[i].innerText = 'itemfc[' + i + ']要素を作成しました';
            // itemfc[i]要素をfigureに追加
            //document.body.appendChild(itemfc[i]);
            $(itemf[i]).append(itemfc[i]);
            const $listfc = $(itemfc[i]);
            
			/*$list.append(FNAME_ROOM + '：' + item.room);
			$list.append('<br>');
			$list.append(FNAME_FUNITURE + '：' + item.funiture);
			$list.append('<br>');*/    //変更　樋口 
            
		    $listfc.append(item.name);
			//$listfc.append('<br>');
		    var img = new Image();
			img.src = item.image;  //変更 樋口
			img.height = 300;
			$listd.append(img);
            
			//$list.append('<hr>');
		}
	}

	// localStorageからSQLっぽくデータ取得
	// 引数	: rest	: 検索条件。 例：{'部屋' : 'リビング', '家具' : 'タンス']）
	// 戻り値	: JSONオブジェクトの配列
	function selectItem(rest = null) {
		let ret = [];

		/// マッチ式の生成(正規表現) ///
		let regexp;
		if (rest == null) {
			console.log('null restriction');
			regexp = new RegExp('.*');
		} else {
			let matchRoom = rest[FNAME_ROOM] != '' ? rest[FNAME_ROOM] : '.?';
			let matchFuniture = rest[FNAME_FUNITURE] != '' ? rest[FNAME_FUNITURE] : '.?';
			let matchName = rest[FNAME_NAME] != '' ? rest[FNAME_NAME] : '.?';

			let matcher = matchRoom + KEY_SPLITTER + 
							matchFuniture + KEY_SPLITTER + 
							matchName;
			regexp = new RegExp(matcher);
            console.log(matcher);
		}

		
		/// 必要なデータを取得 ///
		for (let i = 0; i < localStorage.length; i++) {
			let key = localStorage.key(i);
			let item = JSON.parse(localStorage.getItem(key));
            
            console.log(regexp);
            console.log(key);
			if (regexp.test(key)) {
				ret.push(item);
			}
		}

		return ret;
	}
    
    ////item.htmlにfigureのidを渡す/////
    /*$('#itemf[' + i + ']').on('click', function (){
        var itemnum;
        
        
        
        
        
    });*/
        
})();