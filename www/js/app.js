// This is a JavaScript file
var app = angular.module('myApp',['onsen']);//onsenuiの使用

app.controller('topCtrl',function(){
    this.guideStart = function(){
        myNavigator.pushPage('choice.html');//choiceページへ移動
        weatherFirst = true;
    }
});

app.controller('ChoiceCtrl',function(){
    this.info = function($event){
         moodId = $event.target.id;//こいつはグローバル関数
         myNavigator.pushPage('guide.html');
         weatherSwitch = mySwitch.isChecked(); //こいつはグローバル関数
  
  /*ons.notification.alert({//解答をアラート表示
     message:"気分は"+moodId+"天気は"+weatherSwitch+"がタップされました", 		  
			 });   */
}});


app.controller('guideCtrl',function(guideService,$scope){
    var me = this;//thisをmeに退避
    me.items = {};
    var rightNum = 0;//正解数
    var sugggestSpot = null;//クイズデータ
    
    if(weatherFirst){//初回時にmoodIdが空値となるとエラーが出るため、初回のみ制御
        moodId = 0;
        weatherFirst = false;
    }

    if(weatherSwitch){
        me.weatherWeather = "天気機能を利用しています";
    }else{
        me.weatherWeather = "天気機能を利用していません";
    }
    
    var init = function(){
        me.items.currentNum = moodId;//現在の参照番号
        
    if(weatherSwitch){
        sugggestSpot = JSON.parse(JSON.stringify(guideService.sugggestSpotSunny));//観光地データをサービスより取得&ディープコピー
    }else{
        sugggestSpot = JSON.parse(JSON.stringify(guideService.secondSuggest));//観光地データをサービスより取得&ディープコピー
    }
        
        me.items.totalNum = sugggestSpot.length;//取得したデータの全数
        me.items.mood = sugggestSpot[moodId].mood;//Choiceで押されたキーを取得

        spotInit();
    };
    
    //解答選択肢用意
    var spotInit = function(){
        var currentQ = sugggestSpot[me.items.currentNum];//現在
    	var qLength = currentQ.choices.length;//選択肢数
        me.items.currentQ = currentQ;//現在のデータをデータバインド用オブジェクトに代入
    };
    
  me.dialog = function() {
   var aaa = ons.createDialog('dialog.html');
   aaa.then(function(dialog) {
      dialog.show();
    });
  };
    
    //解答ボタンが押されたら
    me.getAnswer = function(ind){
    	var flag = ind;//正解か間違いか判定
    	var flagText = "間違い";
    	if(flag){//正解だったら
    		rightNum++;//正解数を増やす
    		flagText = "正解";
    	}
    	ons.notification.alert({//解答をアラート表示
			  message: '正解は『' + me.items.currentQ.choices[answerNum] + '』です',
			  title: flagText,
			  buttonLabel: 'NEXT',
			  animation: 'default',
			  callback: function() {// NEXTがクリックされたら
			    if(me.items.currentNum >= me.items.totalNum-1){//全問終了したら
			    	myNavigator.pushPage('result.html',{totalNum:me.items.totalNum,rightNum:rightNum});
			    }else{//まだクイズが残っていれば
			    	me.items.currentNum++;
			    	$scope.$apply(spotInit);//次のクイズ用意
			    }
			  }
		});
    };
    
    
    me.setAnswer = function(placeId){  
    ons.notification.confirm({
     message:placeId,
     title:"ここに行ってみますか？？",
     buttonLabels:["まだ考える", "行く"],
     callback: function() {
      myNavigator.pushPage('detail.html');
    }
			 });   
//各観光地がタップされた状態
         };
           
    
    //左矢印アイコンが推されたら前ページへ戻る
    me.backTop = function(){
        myNavigator.popPage({ animation: "slide" });
    };
    init();
});

app.controller('resultCtrl',function(){
    var rate = 100;
    this.items = myNavigator.getCurrentPage().options;
    this.items.score = this.items.rightNum * rate;
    this.backTop = function(){
    		myNavigator.pushPage('top.html', { animation: "none" });
    };
});

