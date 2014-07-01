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

form = cgi.FieldStorage()
sys.stderr = sys.stdout
cgitb.enable()
log = form["s"].value

print ('Content-type: text/html; charset=UTF-8')
print ("\r\n\r\n")

# 「参加者」以外の議事録の内容を取得するクエリ
query = """
	SELECT DISTINCT ?date ?subject ?discription ?reminder
	 WHERE {
		<"""+log+"""> <http://purl.org/dc/elements/1.1/date> ?date .
		<"""+log+"""> <http://purl.org/dc/elements/1.1/subject> ?subject .
		<"""+log+"""> <http://purl.org/dc/elements/1.1/discription> ?discription .
		<"""+log+"""> <http://linkdata.org/property/rdf1s949i#reminder> ?reminder .
	 }
"""
# 「参加者」のURIと名前を取得するクエリ
query2 = """
	SELECT DISTINCT ?name
	 WHERE{
		<"""+log+"""> <http://linkdata.org/property/rdf1s949i#member> ?member .
		?member <http://www.w3.org/2000/01/rdf-schema#label> ?name .
	 }
"""


g = Graph()
g.parse('../data/log.ttl',format='turtle') # 議事録のデータ
qres = g.query(query)
g.parse('../data/dummy.ttl',format='turtle') # 名刺のデータ
nameRes = g.query(query2)

# 「参加者」だけは複数あるため、繰り返し検索する
member = ""
for find in nameRes:
	member += (find.name).encode('utf_8')

for look in qres:
	print ( """
		<title>議事録</title>
		<h1>"""+(look.subject).encode('utf_8')+"""</h1>
		<p>日付："""+(look.date).encode('utf_8')+"""<br>
		   参加者："""+member+"""	<br>
		内容："""+(look.discription).encode('utf_8')+"""<br>
		備忘録："""+(look.reminder).encode('utf_8')+"""</p>
	""")