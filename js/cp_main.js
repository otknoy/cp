csv = new Array();
nodelist = new Array();
var data;
var target_temp;
var query_temp;
var name_temp;
var s_temp;
var sendData={};
var sendTag={};
var openData=new Array();
var closeData=new Array();
var knowList=new Array();
onload = function() {
    //検索
    $('form.quicksearch').submit(function(){return search($(".quicksearch__input").val())});
    function search(q) {
        $('.result').html("<img src='../cp1.2/img/loader.gif' style='margin: 50px'/>");
        query_temp = $('#query').val();
        $.get('../cp1.2/cgi/rdf_search.cgi',"query="+q,read);
        return false;
    }
    function read(text){
        var hits = JSON.parse(text);
        $('.open_area').hide();
        $('.close_area').hide();
        $('.back_button1').hide();
        $('.back_button2').hide();
        $('.edit_button').hide();
        $('.tag_editer').hide();
        $('.result').empty();
        var len = hits.length
        for(var i =0; i < len; i++) {
            html="<div class='profile' id='"+hits[i].s+"'><div class= 'name'>"+hits[i].name+"</div><div class= 'job'>"+hits[i].job+"</div><div class= 'memo'>"+hits[i].memo+"</div></div>"
            $('.result').append(html);
        }
        
    }

    //検索結果からプロフィールをみる
    $(document).on({
        'click': function(){
            $('.result').html("<img src='../cp1.2/img/loader.gif' style='margin: 50px'/>");
            var name = $(this).text();
            var s = $(this).parent().attr("id");
            name_temp = name;
            s_temp = s;
            return get_profile(name,s);
        },
        'mouseenter': function(){
            $(this).css("cursor","pointer");
            $(this).css("text-decoration","underline");
        },
        'mouseleave': function(){
            $(this).css("cursor","auto");
            $(this).css("text-decoration","none");
        }
    },'.name');
    function get_profile(n,s) {
        $.get('../cp1.2/cgi/getprofile.cgi',"name="+n+"&s="+encodeURIComponent(s),read_profile);
        $('.back_button1').show();
        $('.edit_button').show();
        return false;
    }
    function read_profile(html){
        $('.result').empty();
        $('.result').append(html);
        target_temp = $("*[name=target]").val();
    }

    /*プロフィールを編集する*/
    //編集フォームマウスオーバー時
    $(document).on({
        'mouseenter': function(){
            $(this).css("background-color","#eee");
        },
        'mouseleave': function(){
            $(this).css("background-color","#fff");
        }
    },'.job_detail');
    $(document).on({
        'mouseenter': function(){
            $(this).css("background-color","#eee");
        },
        'mouseleave': function(){
            $(this).css("background-color","#fff");
        }
    },'.name_detail');
    $(document).on({
        'mouseenter': function(){
            $(this).css("background-color","#eee");
        },
        'mouseleave': function(){
            $(this).css("background-color","#fff");
        }
    },'.memo_detail');

    //タグ編集ボタンのやつ
    $(document).on({
        'click': function(){
            sendData ={
                "target" : $("*[name=target]").val(),
                "edit_job" : $("*[name=edit_job]").val(),
                "edit_name" : $("*[name=edit_name]").val(),
                "edit_memo" : $("*[name=edit_memo]").val(),
                "reliability" : $("*[name=reliability]").val()
            };
            return edit_tag();
        }
    },'.edit_button');
    function edit_tag(){
        $.ajax({
            type: "POST",
            url: "../cp1.2/cgi/rdf_edit.cgi",
            data: sendData,
            async: false,
            success: function(){
            }
        });
        $.get('../cp1.2/cgi/mecab.cgi',"memo="+$("*[name=edit_memo]").val()+"&job="+$("*[name=edit_job]").val(),mecab_read);
        return false;   
    }
    //タグをドラッグドロップ可能に
    function tagdraggable(){

        $('.tag').draggable({
            snap:true,
            snapMode:"inner",
            snapTolerance:7
        });
        $('.tag').droppable({
            tolerance: "touch", 
            drop: function(ev, ui) {
                // ドロップされたときにタグを合体
                $("<div class='tag'>"+$(this).text()+ui.draggable.text()+"</div>").appendTo("div.tag_cloud");
                $('.tag').draggable({
                    snap:true,
                    snapMode:"inner",
                    snapTolerance:7
                });
            }
        });

    }
    function mecab_read(html){
        var opentags = [];
        var closetags = [];
        $('.open_tag').each(function(){
            opentags.push($(this).text());//公開タグを配列にいれる
        });
        $('.close_tag').each(function(){
            closetags.push($(this).text());//非公開タグを配列にいれる
        });

        $('.result').empty();
        $('.edit_button').hide();//タグ編集ボタン隠す
        $('.back_button1').hide();//検索結果一覧へ戻るボタン隠す
        $('.back_button2').show();//通常プロフィール画面へ戻るボタンの表示
        //$('.result').html("<img src='img/suimen.png'/>");//--ダサいから消した
        $(".open_area").show();
        $(".close_area").show();
        $(".tag_editer").show();
        // --- 公開エリアのDroppable要素 ---
        $(".open_area").droppable({
            tolerance: "fit",            // Draggable要素が完全に入った場合にDrop可能にする
            hoverClass: "drop_hover",    // Draggable要素が上に乗ったときに適用するクラス
            drop: function(ev, ui) {
                // ドロップされたときにDraggable要素内の文字を配列openDataに追加
                openData.push(ui.draggable.text());
            },
            out: function(ev, ui) {
                // draggable要素が外にでたときその要素を配列から削除
                var point = openData.indexOf(ui.draggable.text());
                openData.splice(point,1);
            }
        });
        // --- 非公開エリアのDroppable要素 ---
        $(".close_area").droppable({
            tolerance: "fit",              // Draggable要素が完全に入った場合にDrop可能にする
            hoverClass: "drop_hover",    // Draggable要素が上に乗ったときに適用するクラス
            drop: function(ev, ui) {
                // ドロップされたときにDraggable要素内の文字を配列に追加
                closeData.push(ui.draggable.text());
            },
            out: function(ev, ui) {
                // draggable要素が外にでたときその要素を配列から削除
                var point = closeData.indexOf(ui.draggable.text());
                closeData.splice(point,1);
            }
        });
        $('.result').append(html);//名刺抽出した結果返してもらってタグ追加
        for(var i =0;i<opentags.length;i++){
            $("<div class='tag' style='position: absolute;top:-350px;left:10px;'>"+opentags[i]+"</div>").appendTo("div.tag_cloud");//もとからあったタグの追加
            openData.push(opentags[i]);
        }
        for(var i =0;i<closetags.length;i++){
            $("<div class='tag' style='position: absolute;top:-100px;left:10px;'>"+closetags[i]+"</div>").appendTo("div.tag_cloud");//もとからあったタグの追加
            closeData.push(closetags[i]);
        }
        tagdraggable();
    }
    $(document).on({
        'click': function(){
            if(knowList.indexOf($( this ).attr( "id" ))!=-1){
                $(this).css("color","#aaa");
                var p = knowList.indexOf($( this ).attr( "id" ));
                knowList.splice(p,1);
            }else{
                $(this).css("color","#777");
                knowList.push($( this ).attr( "id" ));
            }
        },
        'mouseenter': function(){
            $(this).css("background-color","#eee");

        },
        'mouseleave': function(){
            $(this).css("background","none");
        }
    },'.relation');
    //タグを新しく作る
    $(document).on('click','#create', function(){
        $("<div class='tag'>"+$('#tagvalue').val()+"</div>").appendTo("div.tag_cloud");
        tagdraggable();
    });


    //人物詳細へ戻るボタンの処理
    //戻るときにタグ編集内容を保存
    $(document).on('click','.back_button2', function(){
        sendTag={
            "target" : target_temp,
            "open" : openData.join(),
            "close" : closeData.join(),
            "knows" : knowList.join()
        };
        openData=[];
        closeData=[];
        knowList=[];
        return post_tag();
    });
    function post_tag() {
        $.ajax({
            type: "POST",
            url: "../cp1.2/cgi/tag_edit.cgi",
            data: sendTag,
            async: false,
            success: function(){
                $('.result').empty();
                $('.edit_button').show();
                $('.back_button1').show();
                $('.back_button2').hide();
                $(".tag_editer").hide();
                $(".open_area").hide();
                $(".close_area").hide();
                back2();
            }
        });
        $('.result').empty();
        $('.result').html("<img src='../cp1.2/img/loader.gif' style='margin: 50px'/>");
        return false;
    }
    function back2() {
        $.get('../cp1.2/cgi/getprofile.cgi',"name="+name_temp+"&s="+encodeURIComponent(s_temp),reflesh2);
        return false;
    }
    function reflesh2(html){
        $('.tag_editer').hide();
        $('.result').empty();
        $('.result').append(html);
    }

    //編集内容を保存
    $(document).on('click','.back_button1', function(){
        sendData ={
            "target" : $("*[name=target]").val(),
            "edit_job" : $("*[name=edit_job]").val(),
            "edit_name" : $("*[name=edit_name]").val(),
            "edit_memo" : $("*[name=edit_memo]").val(),
            "reliability" : $("*[name=reliability]").val()
        };
        return edit();
    });
    function edit() {
        $.ajax({
            type: "POST",
            url: "../cp1.2/cgi/rdf_edit.cgi",
            data: sendData,
            async: false,
            success: function(){
                $('.result').empty();
                $('.back_button1').hide();
                back1();
            }
        });
        $('.result').empty();
        $('.result').html("<img src='../cp1.2/img/loader.gif' style='margin: 50px'/>");
        return false;
    }
    function back1() {
        return get_profile(name_temp);
        return false;
    }
};