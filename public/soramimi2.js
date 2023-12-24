var flag_speech = 0;
var flag_debug = true;

function webspeech_function(){
  $('#start_btn').removeClass( 'btn-primary btn-warning' );
  $('#start_btn').addClass( 'btn-danger' );
  $('#start_btn').val( '<i class="fas fa-microphone"></i>' );
  $('#voice-language').attr( 'disabled', true );

  webspeech_recognition_loop();
}

function webspeech_recognition_loop(){
  var voice_lang = $('#voice-language').val();
  console.log( 'voice_lang = ' + voice_lang );

  //. https://developer.mozilla.org/ja/docs/Web/API/SpeechRecognition
  window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
  var recognition = new SpeechRecognition(); //webkitSpeechRecognition();
  recognition.lang = voice_lang;
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onaudiostart = function(){
    if( flag_debug ){ console.log( 'onaudiostart' ); }
  };
  recognition.onaudioend = function(){
    if( flag_debug ){ console.log( 'onaudioend' ); }
  };
  recognition.onspeechstart = function(){
    if( flag_debug ){ console.log( 'onspeechstart' ); }
    console.log( 'speech start...');
  };
  recognition.onspeechend = function(){
    if( flag_debug ){ console.log( 'onspeechend' ); }
    console.log( '...speech end.');

    //. そのまま続ける場合、
    webspeech_recognition_loop();

    //. いったん抜ける場合、
    //$('#start_btn').removeClass( 'btn-primary btn-danger' );
    //$('#start_btn').addClass( 'btn-warning' );
    //$('#start_btn').val( '<i class="fas fa-comments"></i>' );
    //$('#voice-language').attr( 'disabled', false );
  };

  recognition.onsoundstart = function(){
    if( flag_debug ){ console.log( 'onsoundstart' ); }
    //$('#status').val( 'Listening' );
  };
  recognition.onnomatch = function(){
    if( flag_debug ){ console.log( 'onnomatch' ); }
  };
  recognition.onerror = function(){
    if( flag_debug ){ console.log( 'onerror' ); }
    if( flag_speech == 0 ){
      webspeech_recognition_loop();
    }
  };
  recognition.onsoundend = function(){
    if( flag_debug ){ console.log( 'onsoundend' ); }

    /*
    //. そのまま続ける場合、
    ///webspeech_recognition_loop();

    //. いったん抜ける場合、
    //$('#start_btn').removeClass( 'btn-primary btn-danger' );
    //$('#start_btn').addClass( 'btn-warning' );
    //$('#start_btn').val( '<i class="fas fa-comments"></i>' );
    //$('#voice-language').attr( 'disabled', false );
    */
  };

  recognition.onresult = function( event ){
    if( flag_debug ){ console.log( 'onresult' ); }
    var results = event.results;
    for( var i = event.resultIndex; i < results.length; i++ ){
      var text = results[i][0].transcript;
      if( results[i].isFinal ){
        $('#result_text').html( '<div class="balloon-r">' + text + '</div>' );
        //. speechText( text );
      }else{
        $('#result_text').html( '<div class="balloon-0">' + text + '</div>' );
        flag_speech = 1;
      }
    }
  }
  flag_speech = 0;
  recognition.start();
}

$(function(){
});

//. 以下、Web Speech 用
var uttr = null;

function speechText( text ){
  //. https://web-creates.com/code/js-web-speech-api/
  if( 'speechSynthesis' in window ){
    var voices = window.speechSynthesis.getVoices();

    uttr = new SpeechSynthesisUtterance();
    uttr.text = text;
    var lang = $('#voice-language').val();  //because AI would be respond in English only.
    uttr.lang = 'en-US'; //. 'en-US', 'ja-JP';

    $('#start_btn').removeClass( 'btn-primary btn-danger' );
    $('#start_btn').addClass( 'btn-warning' );
    $('#start_btn').val( '<i class="fas fa-comments"></i>' );

    window.speechSynthesis.speak( uttr );
    uttr.onend = speechEnd;
  }else{
    alert( 'このブラウザは Web Speech API に未対応です。')
  }
}

function speechEnd( evt ){
  if( flag_debug ){ console.log( 'speechEnd', {evt} ); }

  //. 発声後、すぐに聞き取りモードに入らせる場合
  webspeech_recognition_loop();

  //. 再度ボタンを押させる場合
  $('#start_btn').removeClass( 'btn-warning btn-danger' );
  $('#start_btn').addClass( 'btn-primary' );
  $('#start_btn').val( '<i class="fas fa-comment-alt"></i>' );
  $('#voice-language').attr( 'attr', false );
}
