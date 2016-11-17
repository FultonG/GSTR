var sampleImages = ["e.png", "l.png", "o.png", "h.png"];
var i = 0;
var heightofvideocolumn;
var video = document.querySelector("#videoElement");
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
var w, h, ratio;
var dataURL;
var letterguessed;
var confidence;
var formoption;
var currentpracticeimage;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true}, handleVideo, videoError);
}

function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);
}

function videoError(e) {
    // do something
}

function snap(btnid) {
  if(btnid != "learn" && btnid !="read"){
  $(canvas).fadeIn('fast')
  }
    context.fillRect(0, 0, $('#vidcol').width(), $('#vidcol').height()-5);
    context.drawImage(video, 0, 0, $('#vidcol').width(), $('#vidcol').height()-5);
    dataURL = canvas.toDataURL();
    var basesityfou = dataURL.substr(22);

  if(btnid == "read"){
    console.log("read btn pressed")
    app.models.predict("c43ab714389b4869b28b440bdde4f373", {base64: basesityfou}).then(
      function(response) {
        letterguessed = JSON.stringify(response.data.outputs[0].data.concepts[0].id);
        letterguessed = letterguessed.replace(/\"/g, "")
        confidence = JSON.stringify(response.data.outputs[0].data.concepts[0].value)
        confidence = parseInt(confidence*100)
        $("#translatedText").append(letterguessed+ " ");
        var helpmsg = new SpeechSynthesisUtterance();
            helpmsg.text = letterguessed;
            speechSynthesis.speak(helpmsg);
        console.log(print1);
        console.log(print2);
      },
      function(err) {
        console.log(err)
      }
    );
  }else if (btnid == "learn"){
    console.log("learn btn pressed")
    app.models.predict("c43ab714389b4869b28b440bdde4f373", {base64: basesityfou}).then(
      function(response) {
        letterguessed = JSON.stringify(response.data.outputs[0].data.concepts[0].id);
        letterguessed = letterguessed.replace(/\"/g, "")
        confidence = JSON.stringify(response.data.outputs[0].data.concepts[0].value)
        confidence = parseInt(confidence*100)
        if(letterguessed.toLocaleLowerCase() == currentpracticeimage.substring(0,1)){
          if($('#instructionImage').hasClass('redoverlay')){
            $("#instructionImage").removeClass('redoverlay');
          }
          $("#instructionImage").addClass('greenoverlay');
          var correctmsg = new SpeechSynthesisUtterance();
            correctmsg.text = "Correct!";
            speechSynthesis.speak(correctmsg);
        } else if (letterguessed.toLocaleLowerCase() != currentpracticeimage.substring(0,1)){
          if($('#instructionImage').hasClass('greenoverlay')){
             $("#instructionImage").removeClass('greenoverlay');
          }
          $("#instructionImage").addClass('redoverlay');
          var incorrectmsg = new SpeechSynthesisUtterance();
            incorrectmsg.text = "Incorrect";
            speechSynthesis.speak(incorrectmsg);
        }
        console.log(print1);
        console.log(print2);
      },
      function(err) {
        console.log(err)
      }
    );
  } else if (btnid == "trainH"){
    console.log("trainH submitted")
    app.inputs.create({
      base64: basesityfou,
      concepts: [
        {
          id: "H",
          value: true
        }
      ]
    });
  } else if (btnid == "trainE"){
    console.log("trainE submitted")
    app.inputs.create({
      base64: basesityfou,
      concepts: [
        {
          id: "E",
          value: true
        }
      ]
    });
  } else if (btnid == "trainL"){
    console.log("trainL submitted")
    app.inputs.create({
      base64: basesityfou,
      concepts: [
        {
          id: "L",
          value: true
        }
      ]
    });
  }else if (btnid == "trainO"){
    console.log("trainO submitted")
    app.inputs.create({
      base64: basesityfou,
      concepts: [
        {
          id: "O",
          value: true
        }
      ]
    });
  }else {
    alert("err, invalid btn pressed")
  }
    
}

video.addEventListener('loadedmetadata', function() {
    $('#textcol').height($('#vidcol').height());
    ratio = video.videoWidth / video.videoHeight;
    w = video.videoWidth;
    h = parseInt(w / ratio, 10);
    canvas.width = w;
    canvas.height = h;
}, false);


$('#read').click(function(){
    heightofvideocolumn = $("#vidcol").height()
    $("#textcol").height(heightofvideocolumn);
})

$('#Speak').click(function(){
    var r = $('#translatedText').text().replace(/[^a-zA-Z]+/g, '');
    var helpmsg = new SpeechSynthesisUtterance();
            helpmsg.text = r;
            speechSynthesis.speak(helpmsg);
    
});

$("#clear").click(function() {
   $('#translatedText').text(""); 
});

$("#nextImg").click(function() {
  currentpracticeimage = sampleImages[Math.floor(Math.random()*sampleImages.length)]
   $('#instructionImage').attr('src',currentpracticeimage); 
   $('#instructionImage').height($('#vidcol').height()-10);
   $('#instructionImage').width($('#vidcol').width()-10);
   if($('#instructionImage').hasClass('redoverlay')){
     $("#instructionImage").removeClass('redoverlay');
   }
  if($('#instructionImage').hasClass('greenoverlay')){
      $("#instructionImage").removeClass('greenoverlay');
   }
  
   
});

$(window).on('resize', function () {
  $('#textcol').height($('#vidcol').height());
  $('#instructionImage').height($('#vidcol').height()-10);
   $('#instructionImage').width($('#vidcol').width()-10);
})

$( "#updatemodel" ).on( "submit", function( event ) {
  event.preventDefault();
  formoption = ($("#updatemodel").serializeArray());
  console.log(formoption[0].value);
  snap(formoption[0].value);
});
function iOS() {

  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];

  if (!!navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()){ return true; }
    }
  }

  return false;
}
$(document).ready(function() {
    $('select').material_select();
    $(".button-collapse").sideNav();
    $('.modal').modal();
    if(iOS()){
      $("#vidcol").html('<img class="responsive-img" src="iospopup.png"><canvas></canvas>')
    }
  });

$("#loginform").submit(function(){
    $.post( "/login",$('#loginform').serialize(), function( data ) {
        console.log(data)
        if(data){
            window.location.replace('/developers');
        } else{
            Materialize.toast('Error, Incorrect Username or Password', 4000)
        }
  
});
    return false;
});

$("#registerform").submit(function(){
  console.log($('#registerform').serialize())
    $.post( "/register",$('#registerform').serialize(), function( data ) {
        console.log(data)
        if(data){
            window.location.replace('/');
        } else{
            Materialize.toast('Error, Please check the form.', 4000)
        }
});
    return false;
});

$("#developerslink").click(function(){
    $.get( "/checklogin", function( data ) {
        console.log(data)
        if(data){
            window.location.replace('/developers');
        } else{
           $('#modal1').modal('open');
        }
});
    return false;
});