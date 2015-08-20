#!/usr/bin/python
# -*- coding: utf-8 -*-

# A quick and dirty documentation generator for coffeescript. Outputs JSON files.
# Based on Docco and Pycco (https://fitzgen.github.io/pycco/).

# Command Line Example:
# python docgen.py -i ./src/coffee/core -o ./docs/json/core
# python docgen.py -i ./src/coffee/extend -o ./docs/json/extend

import sys
import getopt
import os
from os.path import isfile, join
import markdown
import copy
import json
import re
import ntpath


inputfile = ''
outputfile = ''


def parse( path ):

    cls = {
        "cls": '',
        "props": [],
        "funcs": [],
        "statics": []
    }

    lines = open(path, "r").read().split("\n")

    classes = []
    class_start = False
    section_start = True
    sec = {"name": "", "description":"", "param": []}

    print "------------"

    for line in lines:

        line = line.strip()

        # new section
        if line.startswith("# #") and not section_start:
            sec = { "name": "", "description": md(line[1:]), "param": []}
            section_start = True

        elif section_start:

            # next '#' means more description about the section
            if line.startswith("#"):
                if "@param" in line:
                    sec["param"].append( md(line.split("@param")[1].strip()) )
                elif "@return" in line:
                    sec["return"] = md(line.split("@return")[1].strip())
                elif "@eg" in line:
                    sec["eg"] = md(line.split("@eg")[1].strip())
                elif "@demo" in line:
                    sec["demo"] = line.split("@demo")[1].strip()
                else:
                    # sec["description"].append( md(line[1:]) )
                    sec["description"] = sec["description"] + md(line[1:])


            # no more comments in the section. get the first line of code and analyze its type
            else:
                if len(line) > 4:
                    head = getType(line)
                    t = head["type"]
                    if t == "cls":

                        # if it's another class in the file
                        if class_start:
                            classes.append( copy.deepcopy(cls) )

                        # class info
                        cls[t] = head["name"]
                        cls["extend"] = head["extend"] if "extend" in head else ""
                        cls["description"] = sec["description"] if "description" in sec else ""
                        cls["file"] = ntpath.basename( path )

                        cls["props"] = []
                        cls["funcs"] = []
                        cls["statics"] = []

                    elif t:

                        sec["name"] = head["name"]

                        if sec["name"].strip() == 'constructor':
                            sec["name"] = cls["cls"]

                        # if t == 'statics':
                        #     sec["name"] = cls["cls"]+"."+sec["name"]

                        if "param" in head:
                            sec["pname"] = head["param"]

                        # add if function or property doesn't start with underscore
                        if sec["name"][0] != "_":
                            cls[t].append( sec )


                    section_start = False
                    class_start = True

    # create JSONs
    classes.append( cls )
    for c in classes:
        createJSON( c )

    return classes



def createJSON( cls ):
    if len(cls["cls"]) > 1 and len(outputfile) > 1:
        outjson = open( join(outputfile, cls["cls"]+".json"), "w" )
        json.dump( cls, outjson, indent=4, sort_keys=True )

    else:
        print "Cannot generate JSON for class "+cls


def createAll( classes ):
    outjson = open( join(outputfile, "all.json"), "w" )
    json.dump( classes, outjson, indent=2, sort_keys=True )

def md(text):
    try:
        return markdown.markdown( text.strip() )
    except UnicodeDecodeError:
        print "Error decoding markdown: "+text
        return text

# Get the type of the section based on the text on that line
def getType(line):

    # class
    if "class" in line:
        print line

        temp = line.split(" ")
        cls = {"type": "cls", "name": temp[1]}
        if len(temp) > 3:
            cls["extend"] = temp[3]

        return cls

    # coffeescript function
    elif "->" in line:
        # print line

        temp = line.split(":")
        temp2 = temp[1].split("->")
        param = temp2[0].strip()[1:-1]

        # static function or object function
        t = "statics" if line[0] == "@" else "funcs"
        return {"type": t,
                "name": temp[0][1:].strip() if t == 'statics' else temp[0].strip(),
                "param": param.strip() }

    # property
    elif "@" in line:
        temp = line.split("=")
        return {"type": "props", "name": temp[0][1:].strip()}

    else:
        print "Unknown line: "+line
        return {"type": False, "name": ""}



if __name__ == "__main__":


    try:
        opts, args = getopt.getopt(sys.argv[1:], "hi:o:", ["ifile=", "ofile="])
    except getopt.GetoptError:
        print 'docgen.py -i <input file or folder> -o <output folder>'
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'docgen.py -i <input file or folder> -o <output folder>'
            sys.exit()
        elif opt in ("-i", "--ifile"):
            inputfile = arg
        elif opt in ("-o", "--ofile"):
            outputfile = arg

    if len(inputfile) == 0:
        print 'Input file not found: docgen.py -i <input file or folder> -o <output folder>'
        sys.exit()

    if len(outputfile) == 0 or isfile(outputfile):
        print 'Output file not valid: docgen.py -i <input file or folder> -o <output folder>'
        sys.exit()

    if isfile( inputfile ):
        parse( inputfile )

    else:
        # pull all the files
        files = os.listdir(inputfile)

        allcls = {}

        for f in files:
            file_path = join(inputfile, f)
            if isfile(file_path) and f.endswith(".coffee"):

                cs = parse(file_path)

                # collect all classes for a single json
                for c in cs:
                    allcls[c["cls"]] = c

        # create single json
        createAll( allcls )


