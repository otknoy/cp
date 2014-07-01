onload = function() {
	$('form.formToRdf').submit(function(){return search($(".mem").val())});
    function search(q) {
        $.post('formToRdf.cgi',"member="+q);
        return false;
    }
}