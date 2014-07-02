#!/usr/local/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import cgitb
import rdflib
import sys
import re
import pprint
import urllib
import logging
import datetime
from rdflib import Graph
from rdflib import URIRef, BNode, Literal
from rdflib import Namespace
from rdflib.namespace import RDF, RDFS, FOAF, DC

sys.stderr = sys.stdout
cgitb.enable()

print ('Content-type: text/html; charset=UTF-8')
print ("\r\n\r\n")

# duumycard(本人)の登録している名刺の人物のURIとその名前を持ってくる
query = """
	SELECT  ?name ?s
     WHERE {
		<http://linkdata.org/resource/rdf1s949i#dummycard> ns1:knows ?s .
		?s <http://www.w3.org/2000/01/rdf-schema#label> ?name .
     }
"""

g = Graph()
g.parse('../data/dummy.ttl',format='turtle')
qres = g.query(query)

# 「参加者」のプルダウンフォームの中身(dummycardが登録した名刺の人物)を繰り返し検索している
# valueにURI 表示は名前
selectionValues = ""
for row in qres:
	selectionValues += "<option value="+ ( row.s ).encode('utf_8') +">"+( row.name ).encode('utf_8')+"</option>"


print str( """
<head>
	<title>議事録</title>
	<link rel='stylesheet' href='../chosen.css'>
	<style type='text/css' media='all'>
    	.chosen-rtl .chosen-drop { left: -9000px; }
	</style>
</head>
<body>
	<h1>議事録の新規作成</h1>
	<form name="formToRdf" action="formToRdf.cgi" method="post">
		<div>
		日付：<input type="date" name="date" value=""><br>
		</div>
		<div class='side-by-side clearfix'>
		参加者：<select name="mem" data-placeholder="参加者を選択..." class="chosen-select" multiple style="width:300px;" tabindex="4">
		"""+
		selectionValues
		+"""
		</select>
		</div>
		議題：<input type="text" name="title" value=""><br>
		内容：<br>
		<textarea name="textarea1" rows="8" cols="40"></textarea><br>
		備忘録：<br>
		<textarea name="textarea2" rows="4" cols="40"></textarea><br>
		<input type="submit" value="登録">
	<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js' type='text/javascript'></script>
	<script src='../js/chosen.jquery.js' type='text/javascript'></script>
 	<script type='text/javascript'>
    	var config = {
    	  '.chosen-select'           : {},
    	  '.chosen-select-deselect'  : {allow_single_deselect:true},
    	  '.chosen-select-no-single' : {disable_search_threshold:10},
    	  '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
    	  '.chosen-select-width'     : {width:"95%"}
    	}
    	for (var selector in config) {
    	  $(selector).chosen(config[selector]);
    	}
	</script>
	</form>
</body>
</html>
""")