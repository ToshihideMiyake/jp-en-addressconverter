function nextfield(str){
    str.value.length==str.maxLength?document.getElementById("zipcode-2").focus():console.log(str.value.length);
}
function searchZip(str){
    if(str.value.length==str.maxLength){
        let api="https://zipcloud.ibsnet.co.jp/api/search?zipcode="
        let zipcode1=document.getElementById("zipcode-1");
        let zipcode2=document.getElementById("zipcode-2");
        let address1=document.getElementById("prefecture");
        let address2=document.getElementById("city");
        let address3=document.getElementById("area");
        let url=api + zipcode1.value + zipcode2.value;
         // 住所初期化
         address1.innerText=address2.innerText=address3.innerText="";
         address1.innerText="検索中・・・";
        console.log(url);
        fetchJsonp(url, {
            timeout: 10000, //タイムアウト時間
        })
        .then((response)=>{
            address1.textContent = ''; //HTML側のエラーメッセージ初期化
            return response.json();  
        })
        .then((data)=>{
            if(data.status === 400){ //エラー時
                address1.textContent = data.message;
            }else if(data.results === null){
                address1.textContent = '郵便番号から住所が見つかりませんでした。';
            } else {
                address1.innerText = data.results[0].kana1;
                address2.innerText = data.results[0].kana2;
                address3.innerText = data.results[0].kana3;
            }
        })
        .catch((ex)=>{ //例外処理
            console.log(ex);
        });
    }else{
        console.log("not yet");
    }
}

function convert(){
    let commaspace=", ";
    let Output=document.getElementById("output");
    let Zipcode=document.getElementById("zipcode-1").value+"-"+document.getElementById("zipcode-2").value+" ";
    let RomanType=localStorage.getItem("RomanSetting");
    let room=document.getElementById("room").value==""?"":"#"+document.getElementById("room").value+commaspace;
    let address4=document.getElementById("more-address").value+commaspace;
    let ZenkanaAddress3=hankana2Zenkana(document.getElementById("area").innerText);
    let ZenkanaAddress2=hankana2Zenkana(document.getElementById("city").innerText);
    let ZenkanaAddress1=hankana2Zenkana(document.getElementById("prefecture").innerText);
    let RomanPrefecture=Prefecture[ZenkanaAddress1]+commaspace;
    let RomanKunreiPrefecture=KunreiPrefecture[ZenkanaAddress1]+commaspace;
    let RomanAddress3=kanaToRoman(ZenkanaAddress3,RomanType).slice(0,1).toUpperCase()+kanaToRoman(ZenkanaAddress3,RomanType).slice(1)+commaspace;//←ローマ字に変換&最初の一文字を大文字に
    let RomanAddress2=kanaToRoman(ZenkanaAddress2,RomanType).slice(0,1).toUpperCase()+kanaToRoman(ZenkanaAddress2,RomanType).slice(1)+commaspace;//←ローマ字に変換&最初の一文字を大文字に

    if(ZenkanaAddress1==""){
        Swal.fire('郵便番号を入力してください')
    }else if(document.getElementById("more-address").value==""){
        Swal.fire('番地以降を入力してください')
    }else{
        execute();
    }

    function execute(){
        if(RomanType=="hepburn"){
            Output.innerText=room+address4+RomanAddress3+RomanAddress2+RomanPrefecture+Zipcode+"Japan";
            stamp();
        }else if(RomanType=="kunrei"){
            Output.innerText=room+address4+RomanAddress3+RomanAddress2+RomanKunreiPrefecture+Zipcode+"Japan";
            stamp();
        }else{
            Swal.fire('変換設定からローマ字表記を選択してください')
        }
    }

}
function stamp(){
    document.getElementById("stamp").classList.add("stamped");
}

function changeRoman(e){
    localStorage.setItem("RomanSetting",e.id);
    if(e.classList.contains("selected")){
        console.log("選択中");
    }else{
        document.querySelectorAll(".dialog__box").forEach(ele=>ele.classList.remove("selected"));
        e.classList.add("selected");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    localStorage.getItem("RomanSetting")==null?localStorage.setItem("RomanSetting","hepburn"):console.log(localStorage.getItem("RomanSetting"));
    changeCSS();
});

function openSetting(){
    changeCSS();
    location.href="#modal";
}

function changeCSS(){
    document.querySelectorAll(".dialog__box").forEach(ele=>ele.classList.remove("selected"));
    if(localStorage.getItem("RomanSetting")=="hepburn"){
        document.getElementById("hepburn").classList.add("selected");
    }else if(localStorage.getItem("RomanSetting")=="kunrei"){
        document.getElementById("kunrei").classList.add("selected");
    }else{
        console.log("設定が反映されていない可能性があります");
    }
}

let nowField=document.getElementById("tenkey__output");

function Keypush(e){
    nowField.innerText=nowField.innerText+e.value;
}
function Keydelete(){
    nowField.innerText=nowField.innerText.slice(0,-1);
}
function Keydone(){
    document.getElementById("more-address").value=nowField.innerText;
    location.href="#";
}
function Tenkey(){
    location.href="#modal-tenkey"
}
function copy(){
    document.getElementById("output").select();
    navigator.clipboard.writeText(document.getElementById("output").value).then(
        ()=>{
                Swal.fire({
                    icon: 'success',
                    title: 'コピー',
                    confirmButtonColor: '#3EA8FF',
                    confirmButtonText: 'OK'
                })
        },
        ()=>{
              Swal.fire({
                    icon: 'error',
                    title: 'コピー失敗'
                })
        }
        );
}
function report(){
    document.getElementById("reportmodal").classList.remove("none");
    document.querySelectorAll("main,footer").forEach(e=>e.classList.add("transparent"));
}
function modalclose(){
    document.getElementById("reportmodal").classList.add("none");
    document.querySelectorAll("main,footer").forEach(e=>e.classList.remove("transparent"));
}
function tutorial(){
    location.href="#modal-tutorial";
}